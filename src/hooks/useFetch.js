/**
 * 仅用于 component 顶层使用，否则
 */
import { useEffect, useState, useRef } from 'react';
import * as _ from 'lodash';
import request from '../utils/request';

function useFetch({ url, params = {} }) {
  const cacheParams = useRef(params); // 避免无限刷新
  const [fetchId, setFetchId] = useState(0);
  const [data, setData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [code, setCode] = useState(0);
  useEffect(() => {
    if (!_.isEqual(params, cacheParams.current)) {
      setFetchId((x) => x + 1);
    }
    cacheParams.current = params;
  });
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await request(url, params);
        if (res.hasError) {
          setHasError(res.hasError);
          setMessage(res.message);
          setCode(res.code);
        }
        setData(res.data);
        setIsLoading(false);
      } catch (e) {
        setHasError(e);
        setMessage(e);
      }
    };
    fetchData();
  }, [fetchId, url]);
  return { data, hasError, isLoading, message, code };
}

export { useFetch };
