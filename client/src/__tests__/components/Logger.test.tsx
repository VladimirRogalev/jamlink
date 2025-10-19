import React from 'react';
import { render, screen } from '@testing-library/react';
import logger from '../../utils/logger';

// Mock the logger
jest.mock('../../utils/logger');

const mockLogger = logger as jest.Mocked<typeof logger>;

// Test component that uses logger
const TestComponent: React.FC = () => {
  const handleClick = () => {
    logger.info('Button clicked', { component: 'TestComponent' });
  };

  return (
    <button onClick={handleClick}>
      Test Button
    </button>
  );
};

describe('Logger in Components', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should log when component action is performed', () => {
    render(<TestComponent />);
    
    const button = screen.getByRole('button', { name: /test button/i });
    button.click();
    
    expect(mockLogger.info).toHaveBeenCalledWith(
      'Button clicked',
      { component: 'TestComponent' }
    );
  });

  it('should handle logger errors gracefully', () => {
    mockLogger.info.mockImplementation(() => {
      throw new Error('Logger error');
    });

    expect(() => {
      render(<TestComponent />);
      const button = screen.getByRole('button', { name: /test button/i });
      button.click();
    }).not.toThrow();
  });
});



