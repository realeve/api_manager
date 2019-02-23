import http from 'axios';
import qs from 'qs';

// 开发模式
export let DEV = false;
export let host = '//localhost';

export const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
};

export const _commonData = {
  rows: 1,
  data: [{ affected_rows: 1, id: Math.ceil(Math.random() * 100) }],
  time: 20,
  ip: '127.0.0.1',
  title: '数据更新/插入/删除返回值'
};

// 导出数据，随机时长
export const mock = (path, time = Math.random() * 2000) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(typeof path === 'string' ? require(path) : path);
    }, time);
  });

// 判断数据类型，对于FormData使用 typeof 方法会得到 object;
let getType = function(data) {
  return Object.prototype.toString
    .call(data)
    .match(/\S+/g)[1]
    .replace(']', '')
    .toLowerCase();
};

export const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let { data, status } = error.response;
    if (status === 401) {
      // 未登录
    } else if (status === 403) {
      // 无权限
    } else if (status <= 504 && status >= 500) {
      // 服务器内部错误
    } else if (status >= 404 && status < 422) {
      // 链接不存在
    }
    const errortext = (codeMessage[status] || '') + data.msg;
    console.error({
      message: `请求错误 ${status}: ${error.config.url}`,
      description: errortext,
      duration: 10
    });
  } else if (error.request) {
    console.error(error.request);
  } else {
    console.error('Error', error.message);
  }
  return Promise.reject(error);
};

const saveToken = (token) => {
  // 自行处理token保存逻辑
};

export const handleData = ({ data }) => {
  // 刷新token
  if (typeof data.token !== 'undefined') {
    // 保存全局token
    saveToken(data.token);
    // 移除token
    Reflect.deleteProperty(data, 'token');
  }
  return data;
};

// 自动处理token更新，data 序列化等
export const axios = (option) => {
  option = Object.assign(option, {
    method: option.method || 'get'
  });

  return http
    .create({
      baseURL: host,
      timeout: 10000,
      transformRequest: [
        function(data) {
          let dataType = getType(data);
          switch (dataType) {
            case 'object':
            case 'array':
              data = qs.stringify(data);
              break;
            default:
              break;
          }
          return data;
        }
      ]
    })(option)
    .then((res) => handleData(res))
    .catch((error) => handleError(error));
};
