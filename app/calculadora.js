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
                if (this.previousOperand !== '') {
                    this.compute();
                }
                this.operation = operation;
                this.previousOperand = this.currentOperand;
                this.currentOperand = '';
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
                    default:
                        return;
                }
                
                this.currentOperand = computation.toString();
                this.operation = undefined;
                this.previousOperand = '';
            }
            
            updateDisplay() {
                this.currentOperandTextElement.innerText = this.currentOperand;
                if (this.operation != null) {
                    this.previousOperandTextElement.innerText = 
                        `${this.previousOperand} ${this.operation}`;
                } else {
                    this.previousOperandTextElement.innerText = '';
                }
            }
        }
        
        const numberButtons = document.querySelectorAll('button:not(.operator):not(.equals):not(.clear):not(.delete)');
        const operatorButtons = document.querySelectorAll('.operator');
        const equalsButton = document.querySelector('.equals');
        const clearButton = document.querySelector('.clear');
        const deleteButton = document.querySelector('.delete');
        const previousOperandTextElement = document.getElementById('previous-operand');
        const currentOperandTextElement = document.getElementById('current-operand');
        
        const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);
        
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