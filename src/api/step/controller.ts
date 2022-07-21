import * as store from './store';

export const getSteps = async (req: IReq) => {
  const params: TGetStepsParams = req.body as any;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { considerer_traffic, maximun_distance, maximun_distance_between_points, plot } = params;

  // de acuerdo al valor de plot, definimos o no trazar una ruta para los pasos
  const newRoutes = plot ? traceRoute(considerer_traffic, []) : store.getRoutes();
  const steps = [];
  let distanceCounter = 0;

  for (let i = 0; i < newRoutes.length; i++) {
    // validamos el maximo de distancia regorido entre los puntos, y determinamos su finalizacion
    if (distanceCounter > maximun_distance) {
      break;
    }

    const route = newRoutes[i];
    let shouldPush = true;
    let action = null;
    let position = 0;

    for (let j = 0; j < steps.length; j++) {
      const step = steps[j];

      // validamos que la coordenada de recogida exista, si existe se agrega en el mismo punto de su coincidencia
      if (route.pickup_location[0] == step.point[0] && route.pickup_location[1] == step.point[1] && step.action === 'pickup') {
        shouldPush = false;
        action = 'pickup';
        position = j;
        break;
      }
    }

    if (shouldPush) {
      // validamos el limite le la distancia entre puntos
      if (route.distance <= maximun_distance_between_points) {
        steps.push({
          action: 'pickup',
          id: route.id,
          point: route.pickup_location,
        });
        distanceCounter = distanceCounter + route.distance;
        steps.push({
          action: 'delevery',
          id: route.id,
          point: route.delivery_location,
        });
      }
    }
    else {
      if (action === 'pickup') {
        shouldPush = false;
        steps.splice(position + 1, 0, {
          action: 'pickup',
          id: route.id,
          point: route.pickup_location,
        });
      }
    }
  }

  return {
    id: Math.floor(Math.random() * 100),
    steps,
  };
};

/* la funcion tiene como objetivo agrupar los puntos de recogida y colocar sus proximmos puntos de recogida de acuerda a su 
 punto de entrega mas cercano */
const traceRoute: TTraceRouteFunction = (considererTraffic, newRoutes, lastPoint = null, lastPointArray = []) => {
  // obtenemos las rutas para validar en cada cordenada nueva
  const routes = store.getRoutes();
  // seleccionamos una cordenada de inicio para iniciar la itereacion
  const pickupLocation = !newRoutes.length ? routes[0].pickup_location : lastPoint;
  const temporal = [];
  let findNewPoint = false;
  // porcentajes que se utilizaran para incrementar el tiempo que podria tanar la ruta de acuerdo al valor que tenga traffic
  const times: IObj = {
    1: 5,
    2: 10,
    3: 15,
    4: 20,
    5: 30,
  };
  // valor asignado al tiempo de duracion por kilometro en valor de minutos
  const timeInMinutes = 3;
  // si es la primera iteracion entonces separa como siguiente coordenada el punto de entrega de la primera coordenada de recogida 
  if (!lastPoint) {
    lastPoint = routes[0].delivery_location;
    findNewPoint = true;
  }
  else {
    // recorremos la nuevas rutas que se van incrementando y validamos que no se repita una nueva busqueda de la coordenada que se este iterando
    for (let i = 0; i < newRoutes.length; i++) {
      let findPoint = false;
      const route = newRoutes[i];

      for (let i = 0; i < lastPointArray.length; i++) {
        const currentLastPoint = lastPointArray[i];
        if (route.delivery_location[0] === currentLastPoint[0] && route.delivery_location[1] === currentLastPoint[1]) {
          findPoint = true;
        }
      }
      if (findPoint === false) {
        findNewPoint = true;
        lastPoint = route.delivery_location;
        break;
      }
    }
  }

  // llenamos un arreglo temporal en el cual se obtienen las nuevas coordenada de recogida de acuerdo a la coordenada que se este iterando
  for (let j = 0; j < routes.length; j++) {
    const route = routes[j];

    if (route.pickup_location[0] == pickupLocation[0] && route.pickup_location[1] == pickupLocation[1]) {
      temporal.push({
        time: (route.distance * timeInMinutes) * ((route.distance * timeInMinutes) * (times[route.traffic] / 100)),
        ...route,
      });
    }
  }

  lastPointArray.push(lastPoint);

  // de acuerdo al valor de considererTraffic, calculamos su proximida en tiempo o distancia
  if (considererTraffic) {
    temporal.sort((routeItem1, routeItem2) => { return routeItem1.time - routeItem2.time; });
  }
  else {
    temporal.sort((routeItem1, routeItem2) => { return routeItem1.distance - routeItem2.distance; });
  }

  newRoutes = newRoutes.concat(temporal);

  // si no se encontro la actual coordenada que se esta iterando en alguna coordenada de recogida simplemente salimos del siclo
  if (!findNewPoint) {
    return newRoutes;
  }

  return traceRoute(considererTraffic, newRoutes, lastPoint, lastPointArray);
};
