function doSomethingWithData(jsondata) {
  console.log(jsondata);
}


d3.json('static/js/example3.json', doSomethingWithData);
