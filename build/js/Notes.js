document.getElementById('add-note-btn').addEventListener('click', addNote);

function addNote() {
    const noteTitle = document.getElementById('note-title').value;
    const noteText = document.getElementById('note-text').value;

    if (noteText.trim() !== "" || noteTitle.trim() !== "") {
        const noteContainer = document.getElementById('notes-container');

        const newNote = document.createElement('div');
        newNote.classList.add('note');

        if (noteTitle.trim() !== "") {
            const noteTitleElement = document.createElement('h3');
            noteTitleElement.innerText = noteTitle;
            newNote.appendChild(noteTitleElement);
        }

        const noteContent = document.createElement('p');
        noteContent.innerText = noteText;

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'X';
        deleteButton.addEventListener('click', () => {
            noteContainer.removeChild(newNote);
        });

        newNote.appendChild(noteContent);
        newNote.appendChild(deleteButton);
        noteContainer.appendChild(newNote);

        document.getElementById('note-title').value = "";
        document.getElementById('note-text').value = "";
    } else {
        alert("Please enter a title or note content.");
    }
}
