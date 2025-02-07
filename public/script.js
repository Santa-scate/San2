document.addEventListener('DOMContentLoaded', function () {
    if (!localStorage.getItem('token')) {
        window.location.href = 'login.html';
    }
    loadStudents();
});

// Fungsi untuk mengambil daftar siswa
async function loadStudents() {
    const token = localStorage.getItem('token');
    const response = await fetch('/students', {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        console.error('Gagal memuat siswa:', response.statusText);
        return;
    }

    const students = await response.json();
    const studentTable = document.getElementById('studentTable');

    studentTable.innerHTML = students.map((s, index) => `
        <tr>
            <td class="border p-2">${s.name}</td>
            <td class="border p-2">${s.ttl}</td>
            <td class="border p-2">${s.nik}</td>
            <td class="border p-2">
                <button onclick="editStudent(${index})" class="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onclick="deleteStudent(${index})" class="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
            </td>
        </tr>
    `).join('');
}

// Fungsi untuk menambah atau mengedit siswa
document.getElementById('studentForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const ttl = document.getElementById('ttl').value;
    const nik = document.getElementById('nik').value;
    const index = document.getElementById('studentForm').dataset.index;
    const token = localStorage.getItem('token');

    if (index) {
        await fetch(`/students/${index}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, ttl, nik })
        });
        delete document.getElementById('studentForm').dataset.index;
    } else {
        await fetch('/students', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, ttl, nik })
        });
    }

    document.getElementById('studentForm').reset();
    loadStudents();
});

// Fungsi untuk mengedit siswa
async function editStudent(index) {
    const token = localStorage.getItem('token');
    const response = await fetch(`/students/${index}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const student = await response.json();

    document.getElementById('name').value = student.name;
    document.getElementById('ttl').value = student.ttl;
    document.getElementById('nik').value = student.nik;
    document.getElementById('studentForm').dataset.index = index;
}

// Fungsi untuk menghapus siswa
async function deleteStudent(index) {
    const token = localStorage.getItem('token');
    await fetch(`/students/${index}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadStudents();
}

// Fungsi logout
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}