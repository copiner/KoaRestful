

//import routesLoader from '../utils/routesLoader';

//import validate from './validates';

import authenticate from './authenticate';

import city from './cities';
//console.log(city);//city  === route

import kitten from './kittens';

let temp = [authenticate, city, kitten];

export default function(app){
    temp.forEach(route => {
        
        app.use(route.routes()).use(
            
            route.allowedMethods({
                throw: true
            })
      );
    });

}

/*

export default function(app) {
  routesLoader(`${__dirname}`).then(files => {
    files.forEach(route => {

        console.log(route);
        
        app.use(route.routes()).use(
            
            route.allowedMethods({
                throw: true
            })
      );
    });
  });
}
*/
