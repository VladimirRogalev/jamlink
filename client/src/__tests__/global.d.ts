declare global {
  var localStorage: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
  };
  
  var sessionStorage: {
    getItem: jest.Mock;
    setItem: jest.Mock;
    removeItem: jest.Mock;
    clear: jest.Mock;
  };
  
  var fetch: jest.Mock;
  
  var console: {
    log: jest.Mock;
    error: jest.Mock;
    warn: jest.Mock;
    info: jest.Mock;
    debug: jest.Mock;
  };
}

export {};


