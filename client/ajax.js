
const Ajax = {
    post(url, header, params){

      return new Promise(function(resolve, reject) {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.setRequestHeader("Content-Type","application/json; charset=utf-8");
          if(Object.keys(header).length !== "0"){
            xhr.setRequestHeader('Authorization', "Bearer "+header.token);
          }

          if(Object.keys(params).length == "0"){
            xhr.send(null);
          } else {
            let temp = {};
            for (let key in params){
                temp[key] = params[key];
            }
            const postParams = JSON.stringify(temp);
            xhr.send(postParams);
          }

          xhr.onreadystatechange = function() {
              if (xhr.readyState == 4) {
                  if (xhr.status == 200) {
                      try {
                          var response = JSON.parse(xhr.responseText);
                          resolve(response);
                      } catch (e) {
                          reject(e);
                      }
                  } else {
                      reject(new Error(xhr.statusText));
                  }
              }
          }
      })

    },
    get(url, header, params){
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            if(Object.keys(params).length == "0"){
              xhr.open('GET', url);
            } else{
              let temp = [];
              for (let key in params){
                  temp.push(key + '=' + params[key]);
              }
              const getParams = temp.join('&');
              xhr.open('GET', url+"?"+getParams);
            }

            if(Object.keys(header).length !== "0"){
              xhr.setRequestHeader('Authorization', "Bearer "+header.token);
            }

            xhr.send(null);

            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        try {
                            var response = JSON.parse(xhr.responseText);
                            resolve(response);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(new Error(xhr.statusText));
                    }
                }
            }
        })

    }

}
