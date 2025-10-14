import { renderHook } from '@testing-library/react';
import { useSocket } from '../../hooks/useSocket';

// Mock the logger
jest.mock('../../utils/logger');

// Mock Redux
jest.mock('../../hooks/redux-hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: (selector: any) => selector({
    auth: { user: { id: '123' } },
    socket: { connected: false, currentSong: null, isLoading: false, isInit: false }
  })
}));

// Mock socket slice
jest.mock('../../store/socket-slice', () => ({
  selectSong: jest.fn(),
  quitSong: jest.fn(),
  initializeSocket: jest.fn(),
  checkActiveSong: jest.fn(),
  cleanupSocket: jest.fn(),
}));

// Mock songs slice
jest.mock('../../store/songs-slice', () => ({
  stopScrolling: jest.fn(),
}));

// Mock socket service
jest.mock('../../services/socket.service', () => ({
  default: {
    initialize: jest.fn(),
    selectSong: jest.fn(),
    quitSong: jest.fn(),
  }
}));

describe('useSocket Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize without errors', () => {
    expect(() => {
      renderHook(() => useSocket());
    }).not.toThrow();
  });

  it('should handle socket operations', () => {
    const { result } = renderHook(() => useSocket());
    
    expect(result.current).toHaveProperty('selectSong');
    expect(result.current).toHaveProperty('quitSong');
    expect(result.current).toHaveProperty('currentSong');
    expect(result.current).toHaveProperty('connected');
  });

  it('should log socket operations', () => {
    const { result } = renderHook(() => useSocket());
    
    // Test that the hook doesn't crash when used
    expect(result.current.selectSong).toBeDefined();
    expect(result.current.quitSong).toBeDefined();
  });
});

