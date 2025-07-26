import React, { useState, useCallback, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewValue: boolean;
}

function App() {
  const [isDark, setIsDark] = useState(false);
  const [state, setState] = useState<CalculatorState>({
    display: '0',
    previousValue: null,
    operation: null,
    waitingForNewValue: false
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const inputNumber = useCallback((num: string) => {
    setState(prevState => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          display: num,
          waitingForNewValue: false
        };
      }
      
      if (prevState.display === '0') {
        return { ...prevState, display: num };
      }
      
      return { ...prevState, display: prevState.display + num };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(prevState => {
      if (prevState.waitingForNewValue) {
        return {
          ...prevState,
          display: '0.',
          waitingForNewValue: false
        };
      }
      
      if (prevState.display.indexOf('.') === -1) {
        return { ...prevState, display: prevState.display + '.' };
      }
      
      return prevState;
    });
  }, []);

  const clear = useCallback(() => {
    setState({
      display: '0',
      previousValue: null,
      operation: null,
      waitingForNewValue: false
    });
  }, []);

  const clearEntry = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      display: '0'
    }));
  }, []);

  const performOperation = useCallback((nextOperation: string) => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue === null) {
        return {
          ...prevState,
          previousValue: inputValue,
          operation: nextOperation,
          waitingForNewValue: true
        };
      }

      if (prevState.operation) {
        const currentValue = prevState.previousValue || 0;
        let result: number;

        switch (prevState.operation) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '×':
            result = currentValue * inputValue;
            break;
          case '÷':
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
          default:
            return prevState;
        }

        return {
          display: String(result),
          previousValue: result,
          operation: nextOperation,
          waitingForNewValue: true
        };
      }

      return prevState;
    });
  }, []);

  const calculate = useCallback(() => {
    setState(prevState => {
      const inputValue = parseFloat(prevState.display);

      if (prevState.previousValue !== null && prevState.operation) {
        const currentValue = prevState.previousValue;
        let result: number;

        switch (prevState.operation) {
          case '+':
            result = currentValue + inputValue;
            break;
          case '-':
            result = currentValue - inputValue;
            break;
          case '×':
            result = currentValue * inputValue;
            break;
          case '÷':
            result = inputValue !== 0 ? currentValue / inputValue : 0;
            break;
          default:
            return prevState;
        }

        return {
          display: String(result),
          previousValue: null,
          operation: null,
          waitingForNewValue: true
        };
      }

      return prevState;
    });
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event;
      
      if (key >= '0' && key <= '9') {
        inputNumber(key);
      } else if (key === '.') {
        inputDecimal();
      } else if (key === '+') {
        performOperation('+');
      } else if (key === '-') {
        performOperation('-');
      } else if (key === '*') {
        performOperation('×');
      } else if (key === '/') {
        event.preventDefault();
        performOperation('÷');
      } else if (key === 'Enter' || key === '=') {
        calculate();
      } else if (key === 'Escape') {
        clear();
      } else if (key === 'Backspace') {
        clearEntry();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputNumber, inputDecimal, performOperation, calculate, clear, clearEntry]);

  const Button: React.FC<{
    onClick: () => void;
    className?: string;
    children: React.ReactNode;
    variant?: 'number' | 'operation' | 'equals' | 'clear';
  }> = ({ onClick, className = '', children, variant = 'number' }) => {
    const baseClasses = "h-16 sm:h-20 rounded-2xl font-semibold text-lg sm:text-xl transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-50";
    
    const variantClasses = {
      number: isDark 
        ? "bg-gray-700 hover:bg-gray-600 text-white focus:ring-blue-400" 
        : "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-blue-400",
      operation: isDark 
        ? "bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-400" 
        : "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-400",
      equals: isDark 
        ? "bg-green-600 hover:bg-green-500 text-white focus:ring-green-400" 
        : "bg-green-500 hover:bg-green-600 text-white focus:ring-green-400",
      clear: isDark 
        ? "bg-red-600 hover:bg-red-500 text-white focus:ring-red-400" 
        : "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400"
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <div className={`w-full max-w-sm sm:max-w-md lg:max-w-lg transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800 border border-gray-700' 
            : 'bg-white border border-gray-200'
        } rounded-3xl p-6 sm:p-8 shadow-2xl`}>
          
          {/* Header with theme toggle */}
          <div className="flex justify-between items-center mb-6">
            <h1 className={`text-2xl sm:text-3xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Calculator_MEDA
            </h1>
            <button
              onClick={toggleTheme}
              className={`p-3 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDark ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {/* Display */}
          <div className={`mb-6 p-6 rounded-2xl ${
            isDark 
              ? 'bg-gray-900 border border-gray-600' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className={`text-right text-3xl sm:text-4xl lg:text-5xl font-mono ${
              isDark ? 'text-white' : 'text-gray-900'
            } break-all`}>
              {state.display}
            </div>
            {state.operation && state.previousValue !== null && (
              <div className={`text-right text-sm mt-2 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {state.previousValue} {state.operation}
              </div>
            )}
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {/* Row 1 */}
            <Button onClick={clear} variant="clear" className="col-span-2">
              Clear
            </Button>
            <Button onClick={clearEntry} variant="clear">
              CE
            </Button>
            <Button onClick={() => performOperation('÷')} variant="operation">
              ÷
            </Button>

            {/* Row 2 */}
            <Button onClick={() => inputNumber('7')}>7</Button>
            <Button onClick={() => inputNumber('8')}>8</Button>
            <Button onClick={() => inputNumber('9')}>9</Button>
            <Button onClick={() => performOperation('×')} variant="operation">
              ×
            </Button>

            {/* Row 3 */}
            <Button onClick={() => inputNumber('4')}>4</Button>
            <Button onClick={() => inputNumber('5')}>5</Button>
            <Button onClick={() => inputNumber('6')}>6</Button>
            <Button onClick={() => performOperation('-')} variant="operation">
              −
            </Button>

            {/* Row 4 */}
            <Button onClick={() => inputNumber('1')}>1</Button>
            <Button onClick={() => inputNumber('2')}>2</Button>
            <Button onClick={() => inputNumber('3')}>3</Button>
            <Button onClick={() => performOperation('+')} variant="operation">
              +
            </Button>

            {/* Row 5 */}
            <Button onClick={() => inputNumber('0')} className="col-span-2">
              0
            </Button>
            <Button onClick={inputDecimal}>.</Button>
            <Button onClick={calculate} variant="equals">
              =
            </Button>
          </div>

          {/* Footer */}
          <div className={`mt-6 text-center text-sm ${
            isDark ? 'text-red-600' : 'text-red-700'
          }`}>
            Use the keyboard for faster typing
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;