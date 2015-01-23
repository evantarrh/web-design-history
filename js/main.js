function doSomethingWithData(jsondata) {
  console.log(jsondata);
}


d3.json('js/exampleSnapshots.json', doSomethingWithData);
