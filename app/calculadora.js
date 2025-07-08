class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (operation === '√') {
            this.squareRoot();
            return;
        }

        if (operation === '^') {
            this.preparePower();
            return;
        }

        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    preparePower() {
        this.operation = '^';
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    squareRoot() {
        if (this.currentOperand === '') return;
        
        const num = parseFloat(this.currentOperand);
        if (num < 0) {
            this.currentOperand = 'Error';
            setTimeout(() => {
                this.currentOperand = '0';
                this.updateDisplay();
            }, 1000);
            return;
        }
        
        const result = Math.sqrt(num);
        this.currentOperand = result.toString();
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null && this.operation !== '√' && this.operation !== '^') {
            this.previousOperandTextElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else if (this.operation === '^') {
            this.previousOperandTextElement.innerText = 
                `${this.previousOperand}^`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

// Selección de elementos
const numberButtons = document.querySelectorAll('button:not(.operator):not(.equals):not(.clear):not(.delete)');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.delete');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Soporte para teclado
document.addEventListener('keydown', (event) => {
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
        calculator.updateDisplay();
    } else if (event.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        const op = event.key === '*' ? '×' : event.key === '/' ? '÷' : event.key;
        calculator.chooseOperation(op);
        calculator.updateDisplay();
    } else if (event.key === '^') {
        calculator.chooseOperation('^');
        calculator.updateDisplay();
    } else if (event.key === 'Enter' || event.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (event.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (event.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    } else if (event.key === 'r' || event.key === 'R') {
        calculator.squareRoot();
    } else if (event.key === 'p' || event.key === 'P') {
        calculator.chooseOperation('^');
    }
});