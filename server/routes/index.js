

import routesLoader from '../utils/routesLoader';

import city from './cities';
console.log(city);//city  === route

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
