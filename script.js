/* ================= DỮ LIỆU KHỞI TẠO ================= */
let savedUser = null;
let listStudents = [
    { maSV: "SV001", name: "La Văn Hiến", age: 20, subject: "Toán rời rạc", score: 8.5 },
    { maSV: "SV002", name: "Dương Việt Nam", age: 36, subject: "Kiểm thử phần mềm", score: 3.6 },
    { maSV: "SV003", name: "Nguyễn Trung Hiếu", age: 20, subject: "Lập trình Web", score: 9.0 }
];

/* MODAL & NAV */
function openLogin() { clearMessages(); document.getElementById("loginModal").style.display = "flex"; }
function openRegister() { clearMessages(); document.getElementById("registerModal").style.display = "flex"; }
function closeModal() { document.querySelectorAll('.modal').forEach(m => m.style.display = "none"); }
function clearMessages() { document.querySelectorAll(".error, .success").forEach(p => p.innerHTML = ""); }

function hideAllSections() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("scoreForm").style.display = "none";
    document.getElementById("searchSection").style.display = "none";
    document.getElementById("paymentSection").style.display = "none";
}

function showHome() { hideAllSections(); document.getElementById("homeContent").style.display = "block"; }
function showScoreForm() { hideAllSections(); document.getElementById("scoreForm").style.display = "block"; }
function showSearchForm() { 
    hideAllSections(); 
    document.getElementById("searchSection").style.display = "block"; 
    renderSearchTable(listStudents); 
}

/* ================= QUẢN LÝ SINH VIÊN (CẬP NHẬT MÃ SV & MÔN) ================= */
function renderSearchTable(data) {
    const tbody = document.getElementById("searchResultBody");
    tbody.innerHTML = data.map((s) => {
        let idx = listStudents.indexOf(s);
        return `<tr>
            <td style="text-align:center; padding:8px;"><b>${s.maSV || 'N/A'}</b></td>
            <td style="padding:8px;">${s.name}</td>
            <td style="padding:8px;">${s.subject || 'N/A'}</td>
            <td style="text-align:center;">${s.score}</td>
            <td style="text-align:center; padding:5px;">
                <button onclick="prepareEdit(${idx})" style="background:orange; padding:3px 8px; font-size:11px; color:white; border:none; cursor:pointer;">Sửa</button>
                <button onclick="deleteStudent(${idx})" style="background:red; padding:3px 8px; font-size:11px; color:white; border:none; cursor:pointer;">Xóa</button>
            </td>
        </tr>`;
    }).join('');
}

function saveStudent() {
    clearMessages();
    // Lấy thêm Mã SV và Môn học
    const maSV = document.getElementById("inputMaSV").value.trim();
    const name = document.getElementById("inputName").value.trim();
    const subject = document.getElementById("inputSubject").value;
    const ageVal = document.getElementById("inputAge") ? document.getElementById("inputAge").value.trim() : "20"; 
    const scoreVal = document.getElementById("inputScore").value.trim();
    const editIndex = document.getElementById("editIndex").value;
    const err = document.getElementById("crudError");

    // GIỮ NGUYÊN BẮT LỖI CŨ CỦA BẠN
    if (!maSV || !name || !subject || !scoreVal) {
        err.innerText = "LỖI: Tên, tuổi, mã SV, môn học và điểm không được để trống!";
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

    const studentData = { maSV, name, age, subject, score };

    if (editIndex === "") {
        listStudents.push(studentData);
    } else {
        listStudents[editIndex] = studentData;
    }

    resetStudentForm();
    renderSearchTable(listStudents);
}

function prepareEdit(index) {
    const s = listStudents[index];
    document.getElementById("inputMaSV").value = s.maSV || "";
    document.getElementById("inputName").value = s.name;
    document.getElementById("inputSubject").value = s.subject || "";
    document.getElementById("inputScore").value = s.score;
    document.getElementById("editIndex").value = index;
    document.getElementById("formTitle").innerText = "Sửa Sinh Viên";
    document.getElementById("btnCancel").style.display = "inline";
    document.getElementById("btnSave").innerText = "CẬP NHẬT";
}

function resetStudentForm() {
    document.getElementById("inputMaSV").value = "";
    document.getElementById("inputName").value = "";
    document.getElementById("inputSubject").value = "";
    document.getElementById("inputScore").value = "";
    document.getElementById("editIndex").value = "";
    document.getElementById("formTitle").innerText = "Thêm Sinh Viên";
    document.getElementById("btnCancel").style.display = "none";
    document.getElementById("btnSave").innerText = "LƯU";
}

/* ================= THANH TOÁN HỌC PHÍ (GIỮ NGUYÊN) ================= */
function showPaymentForm() {
    hideAllSections();
    document.getElementById("paymentSection").style.display = "block";
    const select = document.getElementById("payStudentSelect");
    select.innerHTML = '<option value="">-- Chọn sinh viên --</option>' + 
                      listStudents.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
}

function calculateTuition() {
    clearMessages();
    const studentName = document.getElementById("payStudentSelect").value;
    const creditsVal = document.getElementById("courseCredits").value.trim();
    const agree = document.getElementById("agreeTerms").checked;
    const err = document.getElementById("paymentError");
    const success = document.getElementById("paymentSuccess");
    const resDiv = document.getElementById("paymentResult");

    resDiv.style.display = "none";

    // GIỮ NGUYÊN LOGIC BẮT LỖI THANH TOÁN
    if (!studentName || !creditsVal) {
        err.innerText = "LỖI: Vui lòng chọn sinh viên và nhập số tín chỉ!";
        return;
    }

    const credits = Number(creditsVal);
    if (isNaN(credits) || credits < 1 || credits > 20) {
        err.innerText = "LỖI: Số tín chỉ phải từ 1 đến 20!";
        return;
    }

    if (!agree) {
        err.innerText = "LỖI: Bạn chưa đồng ý điều khoản!";
        return;
    }

    const total = credits * 500000;
    resDiv.style.display = "block";
    document.getElementById("resName").innerText = studentName;
    document.getElementById("resTotal").innerText = total.toLocaleString('vi-VN') + " VNĐ";
    success.innerText = "Xác nhận thanh toán thành công!";
}

/* ================= ĐĂNG KÝ & ĐĂNG NHẬP (GIỮ NGUYÊN) ================= */
/* 1. CHỨC NĂNG ĐĂNG KÝ (Bổ sung bắt lỗi SĐT 10 số, bắt đầu bằng 0) */
function register() {
    // Lấy dữ liệu từ các ô nhập liệu
    const user = document.getElementById('registerUsername').value.trim();
    const pass = document.getElementById('registerPassword').value.trim();
    const confirmPass = document.getElementById('confirmPassword').value.trim();
    const ageValue = document.getElementById('registerAge').value;
    const phone = document.getElementById('registerPhone').value.trim();
    
    // Lấy các thẻ hiển thị thông báo
    const errorMsg = document.getElementById('registerError');
    const successMsg = document.getElementById('registerSuccess');

    // Reset thông báo cũ
    errorMsg.innerText = "";
    successMsg.innerText = "";

    // 1. KIỂM TRA RỖNG (Blank)
    if (!user || !pass || !confirmPass || !ageValue || !phone) {
        errorMsg.innerText = "Lỗi: Vui lòng nhập đầy đủ tất cả các thông tin!";
        return;
    }

    // 2. KIỂM TRA USERNAME (8 - 12 ký tự, không ký tự đặc biệt)
    const userRegex = /^[a-zA-Z0-9]+$/;
    if (user.length < 8 || user.length > 12 || !userRegex.test(user)) {
        errorMsg.innerText = "Lỗi: Username 8-12 ký tự, không chứa ký tự đặc biệt!";
        return;
    }

    // 3. KIỂM TRA PASSWORD (8 - 16 ký tự)
    if (pass.length < 8 || pass.length > 16) {
        errorMsg.innerText = "Lỗi: Password phải từ 8 đến 16 ký tự!";
        return;
    }

    // 4. KIỂM TRA NHẬP LẠI PASSWORD
    if (pass !== confirmPass) {
        errorMsg.innerText = "Lỗi: Mật khẩu nhập lại không trùng khớp!";
        return;
    }

    // 5. KIỂM TRA BIÊN TUỔI (18 - 27)
    const age = parseInt(ageValue);
    if (isNaN(age) || age < 18 || age > 27) {
        errorMsg.innerText = "Lỗi: Tuổi phải nằm trong khoảng từ 18 đến 27!";
        return;
    }

    // 6. KIỂM TRA SỐ ĐIỆN THOẠI (BẮT LỖI CHẶT CHẼ)
    // Giải thích Regex: 
    // ^0 : Bắt đầu bằng số 0
    // \d{9} : Theo sau là đúng 9 chữ số nữa
    // $ : Kết thúc chuỗi (đảm bảo không thừa số thứ 11)
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(phone)) {
        errorMsg.innerText = "Lỗi: Số điện thoại ít nhất 10 số và bắt đầu bằng số 0!";
        return;
    }

    // NẾU VƯỢT QUA TẤT CẢ
    savedUser = { username: user, password: pass }; 
    successMsg.innerText = "Chúc mừng bạn đã đăng ký thành công!";
}

function login() {
    const u = document.getElementById("loginUsername").value.trim();
    const p = document.getElementById("loginPassword").value.trim();
    const err = document.getElementById("loginError");

    if (!savedUser || u !== savedUser.username || p !== savedUser.password) {
        err.innerText = "LỖI: Sai tài khoản hoặc mật khẩu!";
    } else {
        document.getElementById("loginSuccess").innerText = "Đăng nhập thành công!";
        setTimeout(closeModal, 800);
    }
}

function deleteStudent(index) {
    if (confirm("Xóa sinh viên này?")) {
        listStudents.splice(index, 1);
        renderSearchTable(listStudents);
    }
}

function handleSearch() {
    const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
    const filtered = listStudents.filter(s => s.name.toLowerCase().includes(keyword));
    renderSearchTable(filtered);
}
function calculateTuition() {
    clearMessages();
    const studentName = document.getElementById("payStudentSelect").value;
    const creditsVal = document.getElementById("courseCredits").value.trim();
    // Bổ sung dòng lấy giá trị phương thức thanh toán
    const method = document.getElementById("paymentMethod").value; 
    const agree = document.getElementById("agreeTerms").checked;
    
    const err = document.getElementById("paymentError");
    const success = document.getElementById("paymentSuccess");
    const resDiv = document.getElementById("paymentResult");

    resDiv.style.display = "none";

    // Bắt lỗi Rỗng cho cả Sinh viên, Số tín và Phương thức thanh toán
    if (!studentName || !creditsVal || !method) {
        err.innerText = "LỖI: Vui lòng điền đầy đủ thông tin!";
        return;
    }

    // Bắt lỗi giá trị biên cho số tín chỉ (1-20)
    const credits = Number(creditsVal);
    if (isNaN(credits) || credits < 1 || credits > 20) {
        err.innerText = "LỖI: Số tín chỉ phải từ 1 đến 20!";
        return;
    }

    // Bắt lỗi chưa đồng ý điều khoản
    if (!agree) {
        err.innerText = "LỖI: Bạn chưa đồng ý với điều khoản thanh toán!";
        return;
    }

    // Nếu vượt qua tất cả các lỗi trên thì mới tính tiền
    const total = credits * 500000;
    resDiv.style.display = "block";
    document.getElementById("resName").innerText = studentName;
    // Hiển thị phương thức đã chọn vào kết quả nếu cần
    if(document.getElementById("resMethod")) {
        document.getElementById("resMethod").innerText = method;
    }
    document.getElementById("resTotal").innerText = total.toLocaleString('vi-VN') + " VNĐ";
    success.innerText = "Xác nhận thanh toán thành công!";
}