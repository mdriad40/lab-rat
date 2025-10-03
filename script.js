document.addEventListener('DOMContentLoaded', function() {
            // Show/hide Teacher 2 fields based on checkbox
            const teacher2Enable = document.getElementById('teacher2Enable');
            const teacher2Fields = document.getElementById('teacher2Fields');
            teacher2Enable.addEventListener('change', function() {
                teacher2Fields.style.display = this.checked ? 'block' : 'none';
            });
    // Set default date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    
    const formattedToday = `${yyyy}-${mm}-${dd}`;
    const submissionDateEl = document.getElementById('submissionDate');
    submissionDateEl.value = formattedToday;
    if (window.flatpickr) {
        const fp = flatpickr(submissionDateEl, {
            dateFormat: 'Y-m-d',
            defaultDate: formattedToday,
            altInput: true,
            altFormat: 'F j, Y',
            allowInput: true,
            disableMobile: true,
            appendTo: document.body,
            position: 'above',
            onReady: function(selectedDates, dateStr, instance) {
                if (instance.altInput) {
                    instance.set('positionElement', instance.altInput);
                }
            },
            onOpen: function(selectedDates, dateStr, instance) {
                if (instance.altInput) {
                    instance.set('positionElement', instance.altInput);
                }
            }
        });
    }
    
    // Generate preview when button is clicked
    document.getElementById('generateBtn').addEventListener('click', generatePreview);
    
    // Download PDF when button is clicked
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
    
    function generatePreview() {
        // Get all input values
        const courseCode = document.getElementById('courseCode').value || '__________';
        const courseTitle = document.getElementById('courseTitle').value || '__________';
        const experimentNo = document.getElementById('experimentNo').value || '__________';
        const experimentName = document.getElementById('experimentName').value || '__________';
        const studentName = document.getElementById('studentName').value || '__________';
        const studentId = document.getElementById('studentId').value || '__________';
        const section = document.getElementById('section').value || '__________';
        const semester = document.getElementById('semester').value || '__________';
        const batch = document.getElementById('batch').value || '__________';
        const teacher1Name = document.getElementById('teacher1Name').value || '__________';
        const teacher1Designation = document.getElementById('teacher1Designation').value || '__________';
                let teacher2Name = '';
                let teacher2Designation = '';
                if (teacher2Enable.checked) {
                    teacher2Name = document.getElementById('teacher2Name').value || '__________';
                    teacher2Designation = document.getElementById('teacher2Designation').value || '__________';
                }
        
        // Format the date for display
        const submissionDateInput = document.getElementById('submissionDate').value;
        let submissionDate = '__________';
        if (submissionDateInput) {
            const dateObj = new Date(submissionDateInput);
            submissionDate = dateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
        
        // Update preview elements
        document.getElementById('previewCourseCode').textContent = courseCode;
        document.getElementById('previewCourseTitle').textContent = courseTitle;
        document.getElementById('previewExperimentNo').textContent = experimentNo;
        document.getElementById('previewExperimentName').textContent = experimentName;
        document.getElementById('previewStudentName').textContent = studentName;
        document.getElementById('previewStudentId').textContent = studentId;
        document.getElementById('previewSection').textContent = section;
        document.getElementById('previewSemester').textContent = semester;
        document.getElementById('previewBatch').textContent = batch;
        document.getElementById('previewTeacher1Name').textContent = teacher1Name;
        document.getElementById('previewTeacher1Designation').textContent = teacher1Designation;
    document.getElementById('previewTeacher2Name').textContent = teacher2Name;
    document.getElementById('previewTeacher2Designation').textContent = teacher2Designation;
    // Show/hide Teacher 2 block in preview, keep white space
    const teacher2PreviewBlock = document.getElementById('teacher2PreviewBlock');
    teacher2PreviewBlock.style.visibility = teacher2Enable.checked ? 'visible' : 'hidden';
        document.getElementById('previewSubmissionDate').textContent = submissionDate;
        
        // Enable download button
        document.getElementById('downloadBtn').disabled = false;
    }
    
    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const previewElement = document.getElementById('preview');
        html2canvas(previewElement, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210; // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // শুধু এক পেজ add করা হলো
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

            pdf.save('lab_report.pdf');
        });
    }
});
