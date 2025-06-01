const leftLayer = document.querySelector('.layer-left');
        const rightLayer = document.querySelector('.layer-right');
        const toggleBtn = document.getElementById('toggleBtn');
        const restartBtn = document.getElementById('restartBtn');
        const switchBtn = document.getElementById('switchBtn');
        const leftCounter = document.getElementById('leftCounter');
        const rightCounter = document.getElementById('rightCounter');
        const timerDisplay = document.getElementById('timer');
        const jsonItemDisplay = document.getElementById('jsonItem');
        const categorySelection = document.getElementById('categorySelection');
        const categorySelect = document.getElementById('categorySelect');
        const startBtn = document.getElementById('startBtn');
        const tickingSound = document.getElementById('tickingSound');
        const wrapSound = document.getElementById('wrapSound');
        let isPlaying = false;
        let isLeftActive = true;
        let leftSwitches = 0;
        let rightSwitches = 0;
        let timerInterval;
        let timeLeft = 10;
        let jsonIndex = 0;
        let selectedCategory;
        let expectedValue;

        

        // Populate category dropdown
        for (let category in jsonData) {
            let option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }

        startBtn.addEventListener('click', () => {
            selectedCategory = categorySelect.value;
            categorySelection.style.display = 'none';
            restartAnimation();
        });

        function toggleAnimation() {
            if (isPlaying) {
                leftLayer.style.animationPlayState = 'paused';
                rightLayer.style.animationPlayState = 'paused';
                toggleBtn.textContent = 'Resume';
                tickingSound.pause();
                clearInterval(timerInterval);
            } else {
                leftLayer.style.animationPlayState = 'running';
                rightLayer.style.animationPlayState = 'running';
                toggleBtn.textContent = 'Pause';
                tickingSound.play();
                startTimer();
            }
            isPlaying = !isPlaying;
        }

        function triggerBombBlast(side) {
            const x = side === 'left' ? '25%' : '75%';
            const blast = document.createElement('div');
            blast.className = 'bomb-blast';
            blast.style.left = x;
            blast.style.top = '50%';
            document.body.appendChild(blast);

            // Explosion
            blast.style.animation = 'explode 0.5s ease-out forwards';

            // Shockwave
            const shockwave = document.createElement('div');
            shockwave.className = 'bomb-blast';
            shockwave.style.left = x;
            shockwave.style.top = '50%';
            document.body.appendChild(shockwave);
            shockwave.style.animation = 'shockwave 0.5s ease-out forwards';

            // Remove elements after animation
            setTimeout(() => {
                document.body.removeChild(blast);
                document.body.removeChild(shockwave);
            }, 500);
        }

        function restartAnimation() {
            shuffleJsonDataObject();
            resetAnimations();
            startLeftAnimation();
            isLeftActive = true;
            isPlaying = true;
            toggleBtn.style.display = 'inline';
            switchBtn.style.display = 'inline';
            toggleBtn.textContent = 'Pause';
            leftSwitches = 0;
            rightSwitches = 0;
            jsonIndex = 0;
            updateCounters();
            switchBtn.disabled = false;
            tickingSound.currentTime = 0;
            tickingSound.play();
            resetTimer();
            updateTimerPosition();
            updateJsonItem();
            startVoiceInputControl();
        }

        function switchAnimation() {
            if (!isPlaying) return; // Don't switch if animation is paused or completed
            resetAnimations();
            if (isLeftActive) {
                startRightAnimation();
                leftSwitches++;
            } else {
                startLeftAnimation();
                rightSwitches++;
            }
            updateCounters();
            isLeftActive = !isLeftActive;
            if(jsonIndex+1 == jsonData[selectedCategory].length) {
                stopAnimation();
                return;
            }
            jsonIndex = (jsonIndex + 1);
            resetTimer();
            updateTimerPosition();
            updateJsonItem();
            startVoiceInputControl();
        }

        function resetAnimations() {
            leftLayer.style.animation = 'none';
            rightLayer.style.animation = 'none';
            leftLayer.offsetHeight; // Trigger reflow
            rightLayer.offsetHeight; // Trigger reflow
        }

        function startLeftAnimation() {
            leftLayer.style.animation = 'expandLeft 3s ease-in-out forwards';
            leftLayer.style.animationPlayState = 'running';
        }

        function startRightAnimation() {
            rightLayer.style.animation = 'expandRight 3s ease-in-out forwards';
            rightLayer.style.animationPlayState = 'running';
        }

        function updateCounters() {
            leftCounter.textContent = leftSwitches;
            rightCounter.textContent = rightSwitches;
        }

        function stopAnimation() {
            isPlaying = false;
            leftLayer.style.animationPlayState = 'paused';
            rightLayer.style.animationPlayState = 'paused';
            toggleBtn.textContent = 'Resume';
            switchBtn.disabled = true;
            tickingSound.pause();
            wrapSound.play();
            clearInterval(timerInterval);
            timerDisplay.textContent = '0';
            categorySelection.style.display = 'block';

            // Stop voice recognition when game ends
            try {
                if (typeof recognition !== 'undefined' && recognition) {
                    recognition.stop();
                }
                if (typeof isListening !== 'undefined') {
                    isListening = false;
                }
                usrVoiceInput.textContent = 'Game Over!';
            } catch (e) {
                // Ignore errors when stopping
            }

            // Trigger bomb blast on the completed side
            triggerBombBlast(isLeftActive ? 'left' : 'right');
            jsonItemDisplay.innerHTML += "<div>"+expectedValue+"</div>";
        }

        function startTimer() {
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    // Stop voice input and end game when timer expires
                    if (typeof recognition !== 'undefined' && recognition) {
                        recognition.stop();
                    }
                    stopAnimation();
                }
            }, 1000);
        }

        function resetTimer() {
            clearInterval(timerInterval);
            timeLeft = 10;
            timerDisplay.textContent = timeLeft;
            startTimer();
        }

        function updateTimerPosition() {
            if (isLeftActive) {
                timerDisplay.style.left = '25%';
            } else {
                timerDisplay.style.left = '75%';
            }
        }

        function updateJsonItem() {
            const item = jsonData[selectedCategory][jsonIndex];
            expectedValue = jsonData[selectedCategory][jsonIndex].slice(0, -4)
            jsonItemDisplay.innerHTML = "<img src='items/"+selectedCategory+"/"+item+"'></img>"
            if (isLeftActive) {
                jsonItemDisplay.style.left = '5%';
            } else {
                jsonItemDisplay.style.left = '55%';
            }
        }