function getSprintIndex(sprint) {
  var beginSlice = sprint.indexOf('#') + 1;
  var endSlice = sprint.indexOf('\r\n');
  return sprint.slice(beginSlice, endSlice);
}


function getEpicName(epic) {
  var arr = epic.split(/\r?\n/);
  if (arr.length>0) {
    return arr[0];
  }
  return '';
}
