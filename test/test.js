const xhr = new XMLHttpRequest();

// if((xhr.status>= 200 && xhr.status<300)||(xhr.status == 304)){
//   alert(xhr.responseText);
// } else {
//   alert("unsucess"+xhr.status);
// }
xhr.onreadystatechange = function(){
  if(xhr.readyState == 4){
    if((xhr.status>= 200 && xhr.status<300)||(xhr.status == 304)){
      alert(xhr.responseText);
    } else {
      alert("unsucess"+xhr.status);
    }
  }else if(xhr.readyState == 0){
    console.log("000000000000");

  }else if(xhr.readyState == 1){
    console.log("111111111111");
  }else if(xhr.readyState == 2){
    console.log("222222222222");
  }else if(xhr.readyState == 3){
    console.log("333333333333");
  } else {
    console.log("error");
  }
}
xhr.open("get",url, false);
xhr.setRequestHeader("xjx","wds");
//xhr.getResponseHeader("xjx");
xhr.send(null);


xhr.open("post",url, false);
xhr.send({name:"wds"});
