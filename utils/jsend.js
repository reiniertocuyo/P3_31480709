//Formato JSend

function success(data) {
  return { status: 'success', data };
}

function fail(data) {
  return { status: 'fail', data };
}

function error(message, code = 500) {
  return { status: 'error', message, code };
}

module.exports = { success, fail, error };
