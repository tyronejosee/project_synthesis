import React, { useState, useEffect } from "react";

type OperatorType = "+" | "-" | "*" | "/" | "";
type CalculatorState = {
  currentValue: string;
  previousValue: string;
  operator: OperatorType;
  waitingForOperand: boolean;
  memory: number;
};

const Calculator: React.FC = () => {
  const initialState: CalculatorState = {
    currentValue: "0",
    previousValue: "",
    operator: "",
    waitingForOperand: false,
    memory: 0,
  };

  const [state, setState] = useState<CalculatorState>(initialState);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event;

      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        inputDigit(parseInt(key, 10));
      } else if (["+", "-", "*", "/"].includes(key)) {
        event.preventDefault();
        performOperation(key as OperatorType);
      } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculateResult();
      } else if (key === "Backspace") {
        event.preventDefault();
        deleteLastDigit();
      } else if (key === "Escape") {
        event.preventDefault();
        clearAll();
      } else if (key === ".") {
        event.preventDefault();
        inputDot();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state]);

  const clearAll = (): void => {
    setState(initialState);
  };

  const clearEntry = (): void => {
    setState((prev) => ({
      ...prev,
      currentValue: "0",
    }));
  };

  const deleteLastDigit = (): void => {
    const { currentValue } = state;
    setState((prev) => ({
      ...prev,
      currentValue: currentValue.length > 1 ? currentValue.slice(0, -1) : "0",
    }));
  };

  const inputDigit = (digit: number): void => {
    const { currentValue, waitingForOperand } = state;

    if (waitingForOperand) {
      setState((prev) => ({
        ...prev,
        currentValue: digit.toString(),
        waitingForOperand: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        currentValue:
          currentValue === "0" ? digit.toString() : currentValue + digit,
      }));
    }
  };

  const inputDot = (): void => {
    const { currentValue, waitingForOperand } = state;

    if (waitingForOperand) {
      setState((prev) => ({
        ...prev,
        currentValue: "0.",
        waitingForOperand: false,
      }));
    } else if (currentValue.indexOf(".") === -1) {
      setState((prev) => ({
        ...prev,
        currentValue: currentValue + ".",
        waitingForOperand: false,
      }));
    }
  };

  const toggleSign = (): void => {
    const { currentValue } = state;
    setState((prev) => ({
      ...prev,
      currentValue:
        currentValue.charAt(0) === "-"
          ? currentValue.slice(1)
          : "-" + currentValue,
    }));
  };

  const calculateResult = (): void => {
    const { currentValue, previousValue, operator } = state;

    if (!operator || !previousValue) {
      return;
    }

    try {
      const current = parseFloat(currentValue);
      const previous = parseFloat(previousValue);
      let result = 0;

      switch (operator) {
        case "+":
          result = previous + current;
          break;
        case "-":
          result = previous - current;
          break;
        case "*":
          result = previous * current;
          break;
        case "/":
          if (current === 0) {
            setState((prev) => ({
              ...prev,
              currentValue: "Error",
              previousValue: "",
              operator: "",
              waitingForOperand: true,
            }));
            return;
          }
          result = previous / current;
          break;
      }

      setState((prev) => ({
        ...prev,
        currentValue: result.toString(),
        previousValue: "",
        operator: "",
        waitingForOperand: true,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        currentValue: "Error",
        waitingForOperand: true,
      }));
    }
  };

  const performOperation = (nextOperator: OperatorType): void => {
    const { currentValue, previousValue, operator } = state;

    const inputValue = parseFloat(currentValue);

    if (operator && previousValue) {
      const precedingValue = parseFloat(previousValue);
      let result = 0;

      switch (operator) {
        case "+":
          result = precedingValue + inputValue;
          break;
        case "-":
          result = precedingValue - inputValue;
          break;
        case "*":
          result = precedingValue * inputValue;
          break;
        case "/":
          if (inputValue === 0) {
            setState((prev) => ({
              ...prev,
              currentValue: "Error",
              previousValue: "",
              operator: "",
              waitingForOperand: true,
            }));
            return;
          }
          result = precedingValue / inputValue;
          break;
      }

      setState((prev) => ({
        ...prev,
        currentValue: result.toString(),
        previousValue: result.toString(),
        operator: nextOperator,
        waitingForOperand: true,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        previousValue: currentValue,
        operator: nextOperator,
        waitingForOperand: true,
      }));
    }
  };

  const percentage = (): void => {
    const { currentValue } = state;
    const value = parseFloat(currentValue);

    setState((prev) => ({
      ...prev,
      currentValue: (value / 100).toString(),
    }));
  };

  const memoryAdd = (): void => {
    const { currentValue, memory } = state;
    setState((prev) => ({
      ...prev,
      memory: memory + parseFloat(currentValue),
      waitingForOperand: true,
    }));
  };

  const memorySubtract = (): void => {
    const { currentValue, memory } = state;
    setState((prev) => ({
      ...prev,
      memory: memory - parseFloat(currentValue),
      waitingForOperand: true,
    }));
  };

  const memoryRecall = (): void => {
    setState((prev) => ({
      ...prev,
      currentValue: prev.memory.toString(),
      waitingForOperand: true,
    }));
  };

  const memoryClear = (): void => {
    setState((prev) => ({
      ...prev,
      memory: 0,
    }));
  };

  const getDisplayText = (): string => {
    const { currentValue, previousValue, operator, waitingForOperand } = state;

    const operatorSymbol = operator
      ? operator === "*"
        ? "×"
        : operator === "/"
        ? "÷"
        : operator
      : "";

    const secondLine =
      previousValue && operatorSymbol
        ? `${previousValue} ${operatorSymbol} ${
            waitingForOperand ? "" : currentValue
          }`
        : "";

    return currentValue === "Error" ? "Error" : currentValue;
  };

  const getExpressionText = (): string => {
    const { previousValue, operator } = state;

    if (!previousValue) return "";

    const operatorSymbol = operator
      ? operator === "*"
        ? "×"
        : operator === "/"
        ? "÷"
        : operator
      : "";

    return `${previousValue} ${operatorSymbol}`;
  };

  return (
    <div className="calculator-container">
      <div className="calculator-display">
        <div className="expression">{getExpressionText()}</div>
        <div className="result">{getDisplayText()}</div>
      </div>
      <div className="calculator-keypad">
        <div className="function-keys">
          <button className="key function" onClick={memoryAdd}>
            M+
          </button>
          <button className="key function" onClick={memorySubtract}>
            M-
          </button>
          <button className="key function" onClick={memoryRecall}>
            MR
          </button>
          <button className="key function" onClick={memoryClear}>
            MC
          </button>
        </div>
        <div className="digit-keys">
          <div className="calculator-row">
            <button className="key control" onClick={clearAll}>
              AC
            </button>
            <button className="key control" onClick={clearEntry}>
              CE
            </button>
            <button className="key control" onClick={deleteLastDigit}>
              ⌫
            </button>
            <button
              className="key operator"
              onClick={() => performOperation("/")}
            >
              &divide;
            </button>
          </div>
          <div className="calculator-row">
            <button className="key digit" onClick={() => inputDigit(7)}>
              7
            </button>
            <button className="key digit" onClick={() => inputDigit(8)}>
              8
            </button>
            <button className="key digit" onClick={() => inputDigit(9)}>
              9
            </button>
            <button
              className="key operator"
              onClick={() => performOperation("*")}
            >
              &times;
            </button>
          </div>
          <div className="calculator-row">
            <button className="key digit" onClick={() => inputDigit(4)}>
              4
            </button>
            <button className="key digit" onClick={() => inputDigit(5)}>
              5
            </button>
            <button className="key digit" onClick={() => inputDigit(6)}>
              6
            </button>
            <button
              className="key operator"
              onClick={() => performOperation("-")}
            >
              -
            </button>
          </div>
          <div className="calculator-row">
            <button className="key digit" onClick={() => inputDigit(1)}>
              1
            </button>
            <button className="key digit" onClick={() => inputDigit(2)}>
              2
            </button>
            <button className="key digit" onClick={() => inputDigit(3)}>
              3
            </button>
            <button
              className="key operator"
              onClick={() => performOperation("+")}
            >
              +
            </button>
          </div>
          <div className="calculator-row">
            <button className="key digit" onClick={() => percentage()}>
              %
            </button>
            <button className="key digit" onClick={() => inputDigit(0)}>
              0
            </button>
            <button className="key digit" onClick={() => inputDot()}>
              .
            </button>
            <button className="key operator" onClick={calculateResult}>
              =
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
