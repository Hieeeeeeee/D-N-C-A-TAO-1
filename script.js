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

// Hàm ẩn tất cả các section để chuyển đổi menu mượt mà
function hideAllSections() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("scoreForm").style.display = "none";
    document.getElementById("searchSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
}

function showHome() {
    hideAllSections();
    document.getElementById("homeContent").style.display = "block";
}

function showScoreForm() {
    hideAllSections();
    document.getElementById("scoreForm").style.display = "block";
}

function showSearchForm() {
    hideAllSections();
    document.getElementById("searchSection").style.display = "block";
    renderSearchTable(listStudents);
}

/* ================= CHỨC NĂNG THANH TOÁN (MỚI) ================= */

function showPaymentForm() {
    hideAllSections();
    document.getElementById("paymentSection").style.display = "block";
    
    // Đổ danh sách sinh viên hiện có vào ô chọn (Select)
    const select = document.getElementById("payStudentSelect");
    if (listStudents.length === 0) {
        select.innerHTML = '<option value="">Chưa có sinh viên</option>';
    } else {
        select.innerHTML = listStudents.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
    }
}

function calculateTuition() {
    clearMessages();
    const creditsVal = document.getElementById("courseCredits").value.trim();
    const studentName = document.getElementById("payStudentSelect").value;
    const err = document.getElementById("paymentError");
    const success = document.getElementById("paymentSuccess");
    const resDiv = document.getElementById("paymentResult");

    // Reset giao diện kết quả
    resDiv.style.display = "none";

    // 1. Kiểm thử lớp rỗng
    if (!creditsVal || !studentName) {
        err.innerText = "LỖI: Vui lòng chọn sinh viên và nhập số tín chỉ!";
        return;
    }

    const credits = Number(creditsVal);

    // 2. Kiểm thử giá trị biên (Số tín chỉ từ 1 - 20)
    if (isNaN(credits) || credits < 1 || credits > 20) {
        err.innerText = "LỖI: Số tín chỉ phải là số từ 1 đến 20!";
        return;
    }

    // Tính toán tiền (Đơn giá 500.000 VNĐ / tín chỉ)
    const pricePerCredit = 500000;
    const total = credits * pricePerCredit;

    // Hiển thị kết quả thành công
    resDiv.style.display = "block";
    document.getElementById("resName").innerText = studentName;
    document.getElementById("resTotal").innerText = total.toLocaleString('vi-VN') + " VNĐ";
    success.innerText = "Hệ thống đã xác nhận thanh toán thành công!";
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

    if (!name || !ageVal || !scoreVal) {
        err.innerText = "LỖI: Tên, tuổi và điểm không được để trống!";
        return;
    }

    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/; 
    if (!nameRegex.test(name)) {
        err.innerText = "LỖI: Tên phải là ký tự chữ!";
        return;
    }

    const age = Number(ageVal);
    const score = Number(scoreVal);

    if (isNaN(age) || age < 18 || age > 27) {
        err.innerText = "LỖI: Tuổi phải từ 18-27!";
        return;
    }

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

/* 1. CHỨC NĂNG ĐĂNG KÝ (Bắt lỗi User phải là chữ) */
function register() {
    clearMessages();
    const u = document.getElementById("registerUsername").value.trim();
    const p = document.getElementById("registerPassword").value.trim();
    const a = document.getElementById("registerAge").value.trim();
    const err = document.getElementById("registerError");
    const suc = document.getElementById("registerSuccess");

    if (!u || !p || !a) {
        err.innerHTML = "LỖI: Thông tin đăng ký không được để trống!";
        return;
    }

    const alphaRegex = /^[A-Za-z]+$/;
    if (!alphaRegex.test(u)) {
        err.innerHTML = "LỖI: Tên đăng nhập phải là ký tự chữ (không chứa số hoặc ký tự đặc biệt)!";
        return;
    }

    if (u.length < 8 || u.length > 12) {
        err.innerHTML = "LỖI: Tên đăng nhập phải từ 8 đến 12 ký tự.";
        return;
    }

    if (a < 18 || a > 27) {
        err.innerHTML = "LỖI: Tuổi phải từ 18 đến 27.";
        return;
    }

    savedUser = { username: u, password: p, age: a };
    suc.innerText = "Đăng ký thành công!";
}

/* 2. CHỨC NĂNG ĐĂNG NHẬP (Bắt lỗi định dạng và sai tài khoản/mật khẩu) */
function login() {
    clearMessages();
    const u = document.getElementById("loginUsername").value.trim();
    const p = document.getElementById("loginPassword").value.trim();
    const err = document.getElementById("loginError");

    if (!u || !p) {
        err.innerText = "LỖI: Tên đăng nhập và mật khẩu không được để trống!";
        return;
    }

    const alphaRegex = /^[A-Za-z]+$/;
    if (!alphaRegex.test(u)) {
        err.innerText = "LỖI: Tên đăng nhập không hợp lệ (Phải là ký tự chữ)!";
        return;
    }

    if (!savedUser) {
        err.innerText = "LỖI: Tài khoản không tồn tại. Vui lòng đăng ký trước!";
        return;
    }

    if (u === savedUser.username && p === savedUser.password) {
        document.getElementById("loginSuccess").innerText = "Đăng nhập thành công!";
        setTimeout(closeModal, 800);
    } else {
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
function calculateTuition() {
    // Lấy giá trị từ các ô nhập liệu
    const studentName = document.getElementById("payStudentSelect").value; // C1
    const creditsVal = document.getElementById("courseCredits").value.trim(); // C2
    const method = document.getElementById("paymentMethod").value; // C4
    const agree = document.getElementById("agreeTerms").checked; // C5
    
    const err = document.getElementById("paymentError");
    const success = document.getElementById("paymentSuccess");
    const resDiv = document.getElementById("paymentResult");

    // Xóa thông báo cũ mỗi lần nhấn nút
    err.innerText = "";
    success.innerText = "";
    resDiv.style.display = "none";

    // C1: Kiểm tra chọn sinh viên
    if (!studentName) {
        err.innerText = "LỖI: Vui lòng chọn sinh viên!";
        return;
    }

    // C2: Kiểm tra rỗng số tín
    if (!creditsVal) {
        err.innerText = "LỖI: Vui lòng nhập số tín chỉ!";
        return;
    }

    // C3: Kiểm tra giá trị biên (1-20)
    const credits = Number(creditsVal);
    if (isNaN(credits) || credits < 1 || credits > 20) {
        err.innerText = "LỖI: Số tín chỉ phải từ 1 đến 20!";
        return;
    }

    // C4: Kiểm tra hình thức thanh toán
    if (!method) {
        err.innerText = "LỖI: Vui lòng chọn phương thức thanh toán!";
        return;
    }

    // C5: Kiểm tra đồng ý điều khoản
    if (!agree) {
        err.innerText = "LỖI: Bạn chưa đồng ý với điều khoản thanh toán!";
        return;
    }

    // Nếu vượt qua tất cả (Trường hợp TH1 - Hợp lệ)
    const total = credits * 500000;
    resDiv.style.display = "block";
    document.getElementById("resName").innerText = studentName;
    document.getElementById("resMethod").innerText = method;
    document.getElementById("resTotal").innerText = total.toLocaleString('vi-VN') + " VNĐ";
    success.innerText = "Xác nhận thanh toán thành công!";
}