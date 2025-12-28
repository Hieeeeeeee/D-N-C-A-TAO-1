let savedUser = null;
let listStudents = [
    { name: "La Văn Hiến", age: 20, score: 8.5 },
    { name: "Dương Việt Nam", age: 36, score: 3.6 },
    { name: "Nguyễn Trung Hiếu", age: 20, score: 9.0 }
];

/* VALIDATION */
const isValidUsername = (u) => /^[A-Za-z]{8,12}$/.test(u);
const isValidPassword = (p) => p.length >= 8 && p.length <= 12;

/* MODAL & NAV */
function openLogin() { clearMessages(); document.getElementById("loginModal").style.display = "flex"; }
function openRegister() { clearMessages(); document.getElementById("registerModal").style.display = "flex"; }
function closeModal() { document.querySelectorAll('.modal').forEach(m => m.style.display = "none"); }
function clearMessages() { document.querySelectorAll(".error, .success").forEach(p => p.innerHTML = ""); }

function showHome() {
    document.getElementById("homeContent").style.display = "block";
    document.getElementById("scoreForm").style.display = "none";
    document.getElementById("searchSection").style.display = "none";
}

function showScoreForm() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("scoreForm").style.display = "block";
    document.getElementById("searchSection").style.display = "none";
}

function showSearchForm() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("scoreForm").style.display = "none";
    document.getElementById("searchSection").style.display = "block";
    renderSearchTable(listStudents);
}

/* ================= QUẢN LÝ SINH VIÊN (CRUD) ================= */

function renderSearchTable(data) {
    const tbody = document.getElementById("searchResultBody");
    tbody.innerHTML = data.map((s) => {
        let idx = listStudents.indexOf(s);
        return `<tr>
            <td style="padding:8px;">${s.name}</td>
            <td style="text-align:center;">${s.age}</td>
            <td style="text-align:center;">${s.score}</td>
            <td style="text-align:center; padding:5px;">
                <button onclick="prepareEdit(${idx})" style="background:orange; padding:3px 8px; font-size:11px; margin-top:0">Sửa</button>
                <button onclick="deleteStudent(${idx})" style="background:red; padding:3px 8px; font-size:11px; margin-top:0">Xóa</button>
            </td>
        </tr>`;
    }).join('');
}

function saveStudent() {
    clearMessages();
    const name = document.getElementById("inputName").value.trim();
    const ageVal = document.getElementById("inputAge").value.trim();
    const scoreVal = document.getElementById("inputScore").value.trim();
    const editIndex = document.getElementById("editIndex").value;
    const err = document.getElementById("crudError");

    // 1. Kiểm thử lớp rỗng
    if (!name || !ageVal || !scoreVal) {
        err.innerText = "LỖI: Tên, tuổi và điểm không được để trống!";
        return;
    }

    // 2. Kiểm thử tên chỉ chứa chữ
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; 
    if (!nameRegex.test(name)) {
        err.innerText = "LỖI: Tên phải là ký tự chữ!";
        return;
    }

    const age = Number(ageVal);
    const score = Number(scoreVal);

    // 3. Kiểm thử giá trị biên Tuổi (18-27)
    if (isNaN(age) || age < 18 || age > 27) {
        err.innerText = "LỖI: Tuổi phải từ 18-27!";
        return;
    }

    // 4. Kiểm thử giá trị biên Điểm (0-10)
    if (isNaN(score) || score < 0 || score > 10) {
        err.innerText = "LỖI: Điểm phải từ 0-10!";
        return;
    }

    if (editIndex === "") {
        listStudents.push({ name, age, score });
    } else {
        listStudents[editIndex] = { name, age, score };
    }

    resetStudentForm();
    renderSearchTable(listStudents);
}

function deleteStudent(index) {
    if (confirm("Xóa sinh viên này?")) {
        listStudents.splice(index, 1);
        renderSearchTable(listStudents);
    }
}

function prepareEdit(index) {
    const s = listStudents[index];
    document.getElementById("inputName").value = s.name;
    document.getElementById("inputAge").value = s.age;
    document.getElementById("inputScore").value = s.score;
    document.getElementById("editIndex").value = index;
    document.getElementById("formTitle").innerText = "Sửa Sinh Viên";
    document.getElementById("btnCancel").style.display = "inline";
    document.getElementById("btnSave").innerText = "CẬP NHẬT";
}

function resetStudentForm() {
    document.getElementById("inputName").value = "";
    document.getElementById("inputAge").value = "";
    document.getElementById("inputScore").value = "";
    document.getElementById("editIndex").value = "";
    document.getElementById("formTitle").innerText = "Thêm Sinh Viên";
    document.getElementById("btnCancel").style.display = "none";
    document.getElementById("btnSave").innerText = "LƯU";
    clearMessages();
}

function handleSearch() {
    clearMessages();
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    const err = document.getElementById("searchError");

    if (!keyword) {
        err.innerText = "LỖI: Ô tìm kiếm không được để trống!";
        renderSearchTable(listStudents);
        return;
    }

    const filtered = listStudents.filter(s => s.name.toLowerCase().includes(keyword));
    if (filtered.length === 0) err.innerText = "Không tìm thấy kết quả phù hợp.";
    renderSearchTable(filtered);
}

/* LOGIN / REGISTER / SCORE */
/* 1. CHỨC NĂNG ĐĂNG KÝ (Bắt lỗi User phải là chữ) */
function register() {
    clearMessages();
    const u = document.getElementById("registerUsername").value.trim();
    const p = document.getElementById("registerPassword").value.trim();
    const a = document.getElementById("registerAge").value.trim();
    const err = document.getElementById("registerError");
    const suc = document.getElementById("registerSuccess");

    // --- KIỂM THỬ LỚP RỖNG ---
    if (!u || !p || !a) {
        err.innerHTML = "LỖI: Thông tin đăng ký không được để trống!";
        return;
    }

    // --- KIỂM THỬ ĐỊNH DẠNG USER (Phải là ký tự chữ) ---
    // Regex /^[A-Za-z]+$/ đảm bảo chỉ chứa chữ cái A-Z và a-z
    const alphaRegex = /^[A-Za-z]+$/;
    if (!alphaRegex.test(u)) {
        err.innerHTML = "LỖI: Tên đăng nhập phải là ký tự chữ (không chứa số hoặc ký tự đặc biệt)!";
        return;
    }

    // --- KIỂM THỬ ĐỘ DÀI (8-12 ký tự) ---
    if (u.length < 8 || u.length > 12) {
        err.innerHTML = "LỖI: Tên đăng nhập phải từ 8 đến 12 ký tự.";
        return;
    }

    // --- KIỂM THỬ TUỔI (18-27) ---
    if (a < 18 || a > 27) {
        err.innerHTML = "LỖI: Tuổi phải từ 18 đến 27.";
        return;
    }

    // Nếu vượt qua tất cả các lớp kiểm thử
    savedUser = { username: u, password: p, age: a };
    suc.innerText = "Đăng ký thành công!";
}

/* 2. CHỨC NĂNG ĐĂNG NHẬP (Bắt lỗi User phải là chữ) */
/* 2. CHỨC NĂNG ĐĂNG NHẬP (Bắt lỗi định dạng và sai tài khoản/mật khẩu) */
function login() {
    clearMessages();
    const u = document.getElementById("loginUsername").value.trim();
    const p = document.getElementById("loginPassword").value.trim();
    const err = document.getElementById("loginError");

    // --- 1. KIỂM THỬ LỚP RỖNG ---
    if (!u || !p) {
        err.innerText = "LỖI: Tên đăng nhập và mật khẩu không được để trống!";
        return;
    }

    // --- 2. KIỂM THỬ ĐỊNH DẠNG USER (Phải là ký tự chữ) ---
    const alphaRegex = /^[A-Za-z]+$/;
    if (!alphaRegex.test(u)) {
        err.innerText = "LỖI: Tên đăng nhập không hợp lệ (Phải là ký tự chữ)!";
        return;
    }

    // --- 3. KIỂM THỬ SAI TÀI KHOẢN / MẬT KHẨU ---
    // Kiểm tra xem đã có tài khoản nào được đăng ký trong savedUser chưa
    if (!savedUser) {
        err.innerText = "LỖI: Tài khoản không tồn tại. Vui lòng đăng ký trước!";
        return;
    }

    // So khớp dữ liệu nhập vào với dữ liệu đã lưu
    if (u === savedUser.username && p === savedUser.password) {
        document.getElementById("loginSuccess").innerText = "Đăng nhập thành công!";
        setTimeout(closeModal, 800);
    } else {
        // Nếu User đúng nhưng Pass sai, hoặc ngược lại, hoặc sai cả hai
        err.innerText = "LỖI: Tên đăng nhập hoặc mật khẩu không chính xác!";
    }
}

function submitScore() {
    clearMessages();
    const val = document.getElementById("scoreInput").value.trim();
    if (val === "") { document.getElementById("scoreError").innerText = "LỖI: Trống!"; return; }
    if (val < 0 || val > 10) { document.getElementById("scoreError").innerText = "LỖI: 0-10!"; return; }
    document.getElementById("scoreSuccess").innerText = "Đã lưu: " + val;
}