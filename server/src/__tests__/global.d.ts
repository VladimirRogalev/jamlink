declare global {
  var mockLogger: {
    error: jest.Mock;
    warn: jest.Mock;
    info: jest.Mock;
    http: jest.Mock;
    debug: jest.Mock;
  };
}

export {};


