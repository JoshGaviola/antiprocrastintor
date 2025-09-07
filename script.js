// Update slider value display
        const slider = document.getElementById('similarity-slider');
        const thresholdValue = document.getElementById('threshold-value');
        const addTaskBtn = document.getElementById('add-task-btn');
        const taskInput = document.getElementById('task-input');
        const taskList = document.getElementById('task-list');

        console.log("Am I working?");
        
        slider.addEventListener('input', function() {
            thresholdValue.textContent = this.value;
        });

        // Add new task functionality
        addTaskBtn.addEventListener('click', function() {
            const taskText = taskInput.value.trim();
            
            if (taskText === '') {
                alert('Please enter a task name');
                return;
            }
            
            // Create new task element
            const taskItem = document.createElement('div');
            taskItem.className = 'task-item';
            
            const taskSpan = document.createElement('span');
            taskSpan.textContent = taskText;
            
            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';
            
            const playBtn = document.createElement('button');
            playBtn.className = 'btn';
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            
            const editBtn = document.createElement('button');
            editBtn.className = 'btn-secondary';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            
            // Add functionality to the play button
            playBtn.addEventListener('click', function() {
                // Set as current task
                taskInput.value = taskText;
                
                // Reset all play buttons
                document.querySelectorAll('.task-item .btn').forEach(btn => {
                    btn.innerHTML = '<i class="fas fa-play"></i>';
                });
                
                // Mark this one as active
                this.innerHTML = '<i class="fas fa-check"></i>';
            });
            
            // Add functionality to the edit button
            editBtn.addEventListener('click', function() {
                const newTaskText = prompt('Edit your task:', taskSpan.textContent);
                if (newTaskText !== null && newTaskText.trim() !== '') {
                    taskSpan.textContent = newTaskText.trim();
                    
                    // If this was the active task, update the input field too
                    if (taskInput.value === taskText) {
                        taskInput.value = newTaskText.trim();
                    }
                }
            });
            //pkn0
            // Assemble the task item
            taskActions.appendChild(playBtn);
            taskActions.appendChild(editBtn);
            taskItem.appendChild(taskSpan);
            taskItem.appendChild(taskActions);
            
            // Add to the task list
            taskList.appendChild(taskItem);
            
            // Clear the input field
            taskInput.value = '';
        });

        // Mode selector functionality
        const modeButtons = document.querySelectorAll('.mode-btn');
        modeButtons.forEach(button => {
            button.addEventListener('click', function() {
                modeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const statusDot = document.querySelector('.status-dot');
                if (this.textContent === 'Break Time') {
                    statusDot.classList.add('status-off');
                    document.querySelector('.status-indicator span').textContent = 'Protection Paused';
                } else {
                    statusDot.classList.remove('status-off');
                    document.querySelector('.status-indicator span').textContent = 'Protection Active';
                }
            });
        });
        // Simulate task switching for existing tasks
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            item.querySelector('.btn').addEventListener('click', function() {
                const taskName = item.querySelector('span').textContent;
                document.getElementById('task-input').value = taskName;
                
                taskItems.forEach(t => t.querySelector('.btn').innerHTML = '<i class="fas fa-play"></i>');
                this.innerHTML = '<i class="fas fa-check"></i>';
            });
            
            // Add edit functionality to existing tasks
            const editBtn = item.querySelector('.btn-secondary');
            const taskSpan = item.querySelector('span');
            
            editBtn.addEventListener('click', function() {
                const newTaskText = prompt('Edit your task:', taskSpan.textContent);
                if (newTaskText !== null && newTaskText.trim() !== '') {
                    taskSpan.textContent = newTaskText.trim();
                    
                    // If this was the active task, update the input field too
                    if (taskInput.value === taskSpan.dataset.originalText) {
                        taskInput.value = newTaskText.trim();
                    }
                }
            });
        });