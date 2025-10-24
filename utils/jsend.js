//Formato JSend

function success(data) {
  return { status: 'success/sucedio', data };
}

function fail(data) {
  return { status: 'fail/fallo', data };
}

function error(message, code = 500) {
  return { status: 'error', message, code };
}

module.exports = { success, fail, error };
