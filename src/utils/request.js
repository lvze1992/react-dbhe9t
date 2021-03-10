import * as qs from 'qs';

export default async (url, params) => {
  if ((params.method === 'GET' || params.method === void 0) && params.data) {
    url = `${url}?${qs.stringify(params.data)}`;
  }
  const res = await fetch(url, params);
  const data = await res.json();

  if (data.code !== 0) {
    return {
      hasError: true,
      code: data.code,
      message: data.message,
      isLoading: false,
      data: data.data,
    };
  }
  return {
    hasError: false,
    code: data.code,
    message: data.message,
    isLoading: false,
    data: data.data,
  };
};
