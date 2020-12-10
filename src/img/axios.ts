/**
 * axios封装示例
 * 更新日期:2020-12-10
 */
import http, { AxiosRequestConfig, AxiosResponse, AxiosError as _AxiosError } from 'axios';
import qs from "qs";

// 开发模式
export let DEV = false;
export let host = "//localhost";

/**
 * @param affected_rows 数据写操作返回的成功条数
 */
export type TDbWrite = { affected_rows?: number; id?: number; [key: string]: any };
export type TAxiosData = TDbWrite | [];
/**
 * @param title:标题
 * @param rows 数据行
 * @param data 数据
 * @param header 字段列表，报表头
 * @param ip IP地址
 * @param date 请求日期
 * @param source 数据来源:某数据库
 * @param time 当前时间
 * @param serverTime 服务器时间
 * @param hash 当前数据的hash值，数据变更时hash变更
 */
export interface IAxiosState<T = TAxiosData> {
  title: string;
  rows: number;
  data: T[];
  header: string[];
  ip?: string;
  date?: string[];
  source?: string;
  time?: number;
  serverTime: string;
  hash: string;
  token?: string;
  [key: string]: any;
}

export const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

export const _commonData: IAxiosState = {
  rows: 1,
  data: [{ affected_rows: 1, id: Math.ceil(Math.random() * 100) }],
  time: 20,
  ip: "127.0.0.1",
  title: "数据更新/插入/删除返回值",
  header: ["affected_rows", "id"],
  date: [],
  source: "模拟数据",
  serverTime: "",
  hash: "hash"
};

// 导出数据，随机时长
export type MockFn = <T>(path: T, time?: number) => Promise<T>;
export const mock: MockFn = (path, time = Math.random() * 1000) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(path);
    }, time);
  });

export const mockData: <T>(data: T, time?: number) => Promise<T> = (
  data,
  time = Math.random() * 1000
) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, time);
  });

// 判断数据类型，对于FormData使用 typeof 方法会得到 object;
type TypeList =
  | 'object'
  | 'number'
  | 'boolean'
  | 'string'
  | 'null'
  | 'array'
  | 'regexp'
  | 'function'
  | 'undefined'
  | 'symbol';
export const getType: (data: any) => TypeList=(data)=> {
  return Object.prototype.toString
    .call(data)
    .match(/\S+/g)[1]
    .replace("]", "")
    .toLowerCase();
};

export interface AxiosError {
  message: string;
  description: string;
  url: string;
  params: any;
  status?: number;
}
export const handleError: (error: _AxiosError) => Promise<Partial<AxiosError> | null> = async (error) => {
  let config = error.config || {};

  let str = config.params || config.data || {};
  let { id, nonce, ...params } = typeof str === 'string' ? qs.parse(str) : str;
  Reflect.deleteProperty(params, 'tstart2');
  Reflect.deleteProperty(params, 'tend2');
  Reflect.deleteProperty(params, 'tstart3');
  Reflect.deleteProperty(params, 'tend3');

  if (http.isCancel(error)) {
    // 请求取消时无须发送至后台
    return {
      message: '请求取消',
    };
  }

  if (typeof error.message === 'undefined') {
    // 路由取消
    return;
  }

  config.url += `${id ? id + '/' + nonce : ''}?${qs.stringify(params)}`;
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    let { data, status } = error.response;
    if (status === 401) {
      // window.g_app._store.dispatch({
      //   type: 'login?autoLogin=0'
      // }); 
    }

    const errortext = (codeMessage[status] || '') + (data.msg || '');
   
    return Promise.reject({
      status,
      message: `请求错误: ${config.url}`,
      description: `${errortext || ''}`,
      url: error.config.url || '',
      params,
    });
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
  }
  return Promise.reject({
    message: '请求错误',
    description: error.message || '',
    url: (config && config.url) || '',
    params,
  });
};

const saveToken = token => {
  // 自行处理token保存逻辑
};

export const handleUrl = option => {
  if (option?.url?.[0] === '.') {
    option.url = window.location.origin + option.url.slice(1);
  }
  if (option?.url?.includes('@/mock/')) {
    option.url = option.url.replace('@', location.origin);
  }
  return option;
};

export const handleData: <T extends IAxiosState>({ data }: AxiosResponse<T>) => T = ({ data }) => {
  // 刷新token
  if (typeof data.token !== "undefined") {
    // 保存全局token
    saveToken(data.token);
    // 移除token
    Reflect.deleteProperty(data, "token");
  }
  return data;
};


// 自动处理token更新，data 序列化等
export let axios: <T = TAxiosData>(params: AxiosRequestConfig) => Promise<IAxiosState<T>> = (option)=>{

  if (typeof option === 'string') {
    option = {
      url: option,
      method: 'get',
    };
  }
  option = handleUrl(option);
  option = Object.assign(option, {
    method: option.method || "get"
  });

  return http
    .create({
      baseURL: host,
      timeout: 30*1000,
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
        },
      ],
    })(option)
    .then(handleData)
    .catch(error => (error));
};


export const jsonp = (url, data) => {
  if (!url) throw new Error('url is necessary');
  const callback = 'jsonpCallback';
  //  +
  // Math.random()
  //   .toString()
  //   .substr(9, 18);
  const JSONP = document.createElement('script');
  JSONP.setAttribute('type', 'text/javascript');

  const headEle = document.getElementsByTagName('head')[0];

  let ret = '';
  if (data) {
    if (typeof data === 'string') ret = '&' + data;
    else if (typeof data === 'object') {
      for (let key in data) ret += '&' + key + '=' + encodeURIComponent(data[key]);
    }
    ret += '&_time=' + Date.now();
  }
  JSONP.src = `${url}?callback=${callback}${ret}`;
  return new Promise((resolve, reject) => {
    window[callback] = r => {
      resolve(r);
      headEle.removeChild(JSONP);
      delete window[callback];
    };
    headEle.appendChild(JSONP);
  });
};
