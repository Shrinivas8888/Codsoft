
        let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let memoryValue = 0;
        let resetScreen = false;

        const display = document.getElementById('display');
        const numberButtons = document.querySelectorAll('.number');
        const operatorButtons = document.querySelectorAll('.operator:not(#plus-minus):not(#equals)');
        const clearButton = document.getElementById('clear');
        const plusMinusButton = document.getElementById('plus-minus');
        const equalsButton = document.getElementById('equals');
        const mcButton = document.getElementById('mc');
        const mrButton = document.getElementById('mr');
        const mPlusButton = document.getElementById('m-plus');
        const mMinusButton = document.getElementById('m-minus');

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function appendNumber(number) {
            if (currentInput === '0' || resetScreen) {
                currentInput = number;
                resetScreen = false;
            } else {
                currentInput += number;
            }
            updateDisplay();
        }

        function chooseOperation(op) {
            if (currentInput === '') return;
            if (previousInput !== '') {
                compute();
            }
            operation = op;
            previousInput = currentInput;
            currentInput = '';
            updateDisplay();
        }

        function compute() {
            let computation;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            if (isNaN(prev)) return;

            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '÷':
                    computation = prev / current;
                    break;
                case '%':
                    computation = prev % current;
                    break;
                case '1/x':
                    computation = 1 / prev;
                    break;
                default:
                    return;
            }
            
            currentInput = computation.toString();
            operation = null;
            previousInput = '';
            resetScreen = true;
            updateDisplay();
        }

        function clear() {
            currentInput = '0';
            previousInput = '';
            operation = null;
            updateDisplay();
        }

        function toggleSign() {
            currentInput = (parseFloat(currentInput) * -1).toString();
            updateDisplay();
        }

        function handleMemory(action) {
            switch (action) {
                case 'MC':
                    memoryValue = 0;
                    break;
                case 'MR':
                    currentInput = memoryValue.toString();
                    updateDisplay();
                    break;
                case 'M+':
                    memoryValue += parseFloat(currentInput) || 0;
                    break;
                case 'M-':
                    memoryValue -= parseFloat(currentInput) || 0;
                    break;
            }
        }

        numberButtons.forEach(button => {
            button.addEventListener('click', () => {
                appendNumber(button.textContent);
            });
        });

        operatorButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.textContent === '1/x') {
                    currentInput = (1 / parseFloat(currentInput)).toString();
                    updateDisplay();
                } else {
                    chooseOperation(button.textContent);
                }
            });
        });

        equalsButton.addEventListener('click', compute);
        clearButton.addEventListener('click', clear);
        plusMinusButton.addEventListener('click', toggleSign);

        mcButton.addEventListener('click', () => handleMemory('MC'));
        mrButton.addEventListener('click', () => handleMemory('MR'));
        mPlusButton.addEventListener('click', () => handleMemory('M+'));
        mMinusButton.addEventListener('click', () => handleMemory('M-'));

        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
            else if (e.key === '.') appendNumber('.');
            else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                const opMap = {
                    '+': '+',
                    '-': '-',
                    '*': '*',
                    '/': '÷'
                };
                chooseOperation(opMap[e.key]);
            }
            else if (e.key === 'Enter' || e.key === '=') compute();
            else if (e.key === 'Escape') clear();
            else if (e.key === '%') chooseOperation('%');
        });
   