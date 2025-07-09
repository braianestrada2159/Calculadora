// Clase principal de la calculadora
class Calculator {
    // Constructor que recibe los elementos HTML para mostrar operandos
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();// Inicializa la calculadora
    }

    // Limpia todos los valores de la calculadora
    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    //Elimina el último dígito del operando actual
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    // Cambia el signo del operando actual
    changeSign() {
        if (this.currentOperand === '0') return;
        if (this.currentOperand.startsWith('-')) {
            this.currentOperand = this.currentOperand.substring(1);
        } else {
            this.currentOperand = '-' + this.currentOperand;
        }
    }

    // Añade un número al operando actual
    appendNumber(number) {
        // Evita múltiples puntos decimales
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    // Selecciona una operación a realizar
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

        if (operation === '%') {
            this.calculatePercentage();
            return;
        }

        if (operation === '1/x') {
            this.calculateReciprocal();
            return;
        }

        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    // Prepara la operación de potencia
    preparePower() {
        this.operation = '^';
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    // Calcula el porcentaje del operando actual
    calculatePercentage() {
        if (this.currentOperand === '') return;
        
        const num = parseFloat(this.currentOperand);
        const percentage = num / 100;
        this.currentOperand = percentage.toString();
        this.updateDisplay();
    }

    // Calcula el recíproco (1/x) del operando actual
    calculateReciprocal() {
        if (this.currentOperand === '' || this.currentOperand === '0') {
            this.currentOperand = 'Error';
            setTimeout(() => {
                this.currentOperand = '0';
                this.updateDisplay();
            }, 1000);
            return;
        }
        
        const num = parseFloat(this.currentOperand);
        const reciprocal = 1 / num;
        this.currentOperand = reciprocal.toString();
        this.updateDisplay();
    }

    // Realiza el cálculo basado en la operación seleccionada
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        // Verifica que ambos operandos sean números válidos
        if (isNaN(prev) || isNaN(current)) return;

        // Realiza la operación correspondiente
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

        // Actualiza el operando actual con el resultado
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    // Calcula la raíz cuadrada del operando actual
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

    // Actualiza la visualización en la interfaz
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null && this.operation !== '√' && this.operation !== '^' && this.operation !== '%' && this.operation !== '1/x') {
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
const numberButtons = document.querySelectorAll('button:not(.operator):not(.equals):not(.clear):not(.delete):not(.sign-change):not(.percentage)');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');
const deleteButton = document.querySelector('.delete');
const signChangeButton = document.querySelector('.sign-change');
const piButton = document.querySelector('.pi');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

// Crea una instancia de la calculadora
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Botones numéricos
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

// Botones de operación
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

// Botón de igual (=)
equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

// Botón de limpiar (C)
clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

// Botón de borrar (←)
deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Botón de cambio de signo (+/-)
signChangeButton.addEventListener('click', () => {
    calculator.changeSign();
    calculator.updateDisplay();
});

// Botón de PI (π)
piButton.addEventListener('click', () => {
    calculator.appendNumber(Math.PI.toFixed(8)); // usa solo 8 decimales
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
    } else if (event.key === '%') {
        calculator.chooseOperation('%');
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
    } else if (event.key === 's' || event.key === 'S') {
        calculator.changeSign();
        calculator.updateDisplay();
    } else if (event.key === 'i' || event.key === 'I') {
        calculator.chooseOperation('1/x');
        calculator.updateDisplay();
    }     
});