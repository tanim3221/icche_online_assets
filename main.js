$(function() {
    $(document).on('click', '#download_question', function(e) {
        e.preventDefault();
        var exam_name = $('[name="exam_name"]').val();
        var exam_time = $('[name="exam_time"]').val();
        var exam_sub = $('[name="subject"]').val();
        var exam_question = $('[name="question"]').val();
        var generateexam = 'generateexam';
        console.log('Click for download questions');
        if (exam_name !== '' && exam_sub !== '' && exam_time !== '' && exam_question !== '') {
            location.href = "question_print.php?exam_name=" + exam_name + "&question=" + exam_question + "&exam_time=" + exam_time + "&subject=" + exam_sub + "&generateexam";
        }

    });

    // $('#generate_questions').submit(function(e) {
    $(document).on('click', '#generate_exam', function(e) {
        e.preventDefault();
        var info = $('#generate_questions').serialize();
        // e.preventDefault();
        // var info = $(this).serialize();
        $('#generate_exam').attr('disabled', 'disabled');
        console.log('Click for generate questions');
        $.ajax({
            type: 'POST',
            url: 'exam-system.php',
            data: info,
            dataType: 'json',
            success: function(response) {
                $('#generate_exam').removeAttr('disabled', 'disabled');
                if (response.error) {
                    toastr.error(response.message);
                } else {
                    getExamList();
                    toastr.success(response.message);
                }
            }
        });
    });

    $(document).on('click', '#final_submit_ans', function(e) {
        e.preventDefault();
        var all_ans = $('#submit_ans_final').serialize();
        $('.top_title_all').toggleClass('attend');
        var session_id = $(this).data('session_id');
        var session_key = $(this).data('session_key');
        var url = 'exam-system.php?exam_result&view_ans&session_id=' + session_id + '&session_key=' + session_key;
        var title = 'আপনার পরীক্ষার ফলাফল';
        console.log('Click for Submit Ans');
        $.ajax({
            type: 'POST',
            url: 'exam-system.php',
            data: all_ans,
            dataType: 'json',
            success: function(response) {
                if (response.error) {
                    console.log('Error');
                    toastr.error(response.message);
                } else {
                    $('.timer_exam').hide();
                    $('.mobile_nav_close').show();
                    $('.main_footer_mobile.navbar').show();
                    getExam(url, title);
                    console.log('Success');
                    toastr.success(response.message);
                }
            }
        });
    });
    $(document).on('click', '.mobile_nav_close, .mobile_nav_close .mdi-close', function(e) {
        e.preventDefault();
        $('.mobile_nav_wrapper').hide();
    })
    $(document).on('click', '#my_pro', function(e) {
        e.preventDefault();
        $('.mobile_nav_wrapper').show();
    })
    $(document).on('click', '#attend_exam', function(e) {
        e.preventDefault();
        $('.close_btn').hide();
        var exam_time = $(this).data('exam_time');
        var session_id = $(this).data('session_id');
        var subject = $(this).data('subject');
        var session_key = $(this).data('session_key');
        var url = 'exam-system.php?exam_attend&participate&session_id=' + session_id + '&session_key=' + session_key;
        var title = 'পরীক্ষা শুরু হয়েছে [' + subject + ']';
        $('.top_title_all').toggleClass('attend');
        getExam(url, title, exam_time);
        $('.mobile_nav_close').hide();
        $('.main_footer_mobile.navbar').hide();
    });
    $(document).on('click', '#old_exam', function(e) {
        e.preventDefault();
        getExamList();
        $('.mobile_nav_wrapper').show();
    });

    $(document).on('click', '#cancel_exam, #home_btn', function(e) {
        e.preventDefault();
        location.reload();
    });
    $(document).on('click', '#close_window_result', function(e) {
        e.preventDefault();
        getExamList();
    });
    $(document).on('click', '#view_question_form', function(e) {
        e.preventDefault();
        getExamForm();
        $('.mobile_nav_wrapper').show();
    });

    $(document).on('click', '#clickNameData', function(e) {
        e.preventDefault();
        var fname = $(this).data('fname');
        var lname = $(this).data('lname');
        $('#lname').val(lname);
        $('#fname').val(fname);
        $('#nameChangeModal').modal({
            show: true
        });
    });

    $(document).on('click', '#clickEmailData', function(e) {
        e.preventDefault();
        var email = $(this).data('email');
        $('#email').val(email);
        $('#emailChangeModal').modal({
            show: true
        });
    });

    $(document).on('click', '#clickImgData', function(e) {
        e.preventDefault();
        $('#imgChangeModal').modal({
            show: true
        });
    });
    $(document).on('click', '#clickPassData', function(e) {
        e.preventDefault();
        $('#passChangeModal').modal({
            show: true
        });
    });

    $(document).on('click', '#logout_app', function(e) {
        e.preventDefault();
        console.log('Click on Logout.')
        window.location.href = 'logout.php';
    });
    $(document).on('click', '#my_pro', function(e) {
        e.preventDefault();
        getMyPro();
        $('.mobile_nav_wrapper').show();
    });
    $(document).on('click', '#board', function(e) {
        e.preventDefault();
        getAppBoard();
        $('.mobile_nav_wrapper').show();
    });
    $(document).on('click', '#close_window_list', function(e) {
        e.preventDefault();
        location.reload();
        // var main_page = $('.exam_create').html();
        // $('#main_wrapper').html(main_page);
        // $('.exam_list').hide();
    });

    $(document).on('click', '#result_exam', function(e) {
        e.preventDefault();
        var session_id = $(this).data('session_id');
        var session_key = $(this).data('session_key');
        var subject = $(this).data('subject');
        var url = 'exam-system.php?exam_result&view_ans&session_id=' + session_id + '&session_key=' + session_key;
        var title = 'আপনার পরীক্ষার ফলাফল [' + subject + ']';
        var close = '<i id="close_window_result" class="fas fa-times"></i>'
        getExam(url, title, close);
        $('.timer_exam').hide();
        $('.mobile_nav_wrapper').show();
    });
});

function getExamList() {
    var spinner = '<div class="text-center spinner_exam"><span class="text-center spinner-border text-success"></span></div>';
    $('.mobile_nav_body').html(spinner);
    $.ajax({
        type: 'GET',
        url: 'exam-system.php?exam_list',
        dataType: 'html',
        success: function(response) {
            $('.mobile_nav_body').html(response);
            $('.mobile_nav_title').html('আপনার পরীক্ষার তালিকা');
        }
    });
}


function getExamForm() {
    var spinner = '<div class="text-center spinner_exam"><span class="text-center spinner-border text-success"></span></div>';
    $('.mobile_nav_body').html(spinner);
    $.ajax({
        type: 'GET',
        url: 'exam-system.php?exam_create',
        dataType: 'html',
        success: function(response) {
            $('.mobile_nav_body').html(response);
            $('.mobile_nav_title').html('প্রশ্ন তৈরী করুন');
        }
    });
}

function getMyPro() {
    var spinner = '<div class="text-center spinner_exam"><span class="text-center spinner-border text-success"></span></div>';
    $('.mobile_nav_body').html(spinner);
    $.ajax({
        type: 'GET',
        url: 'exam-system.php?my_pro',
        dataType: 'html',
        success: function(response) {
            $('.mobile_nav_body').html(response);
            $('.mobile_nav_title').html('আমার তথ্য');
        }
    });
}

function getAppBoard() {
    var spinner = '<div class="text-center spinner_exam"><span class="text-center spinner-border text-success"></span></div>';
    $('.mobile_nav_body').html(spinner);
    $.ajax({
        type: 'GET',
        url: 'exam-system.php?ranking',
        dataType: 'html',
        success: function(response) {
            $('.mobile_nav_body').html(response);
            $('.mobile_nav_title').html('নম্বর তালিকা');
        }
    });
}

function getExam(url, title, exam_time) {
    var spinner = '<div class="text-center spinner_exam"><span class="text-center spinner-border text-success"></span></div>';
    $('.mobile_nav_body').html(spinner);
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'html',
        success: function(response) {
            $('.mobile_nav_body').html(response);
            $('.mobile_nav_title').html(title);
            console.log(exam_time);
            getTimeExam(exam_time);
        }
    });
}

function getTimeExam(exam_time) {
    var timedata = exam_time + ":00";
    var interval = setInterval(function() {
        var timer = timedata.split(':');
        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        minutes = (minutes < 1) ? '00' : minutes;
        //minutes = (minutes < 10) ?  minutes : minutes;
        var time_full = minutes + ' : ' + seconds;
        $('.timer_exam').html('সময়ঃ ' + replaceNumbers(time_full));
        if (minutes < 0) clearInterval(interval);
        //check if both minutes and seconds are 0
        if ((seconds <= 0) && (minutes <= 0)) {
            clearInterval(interval);
            // $('#final_submit_ans').click();
            $('#final_submit_ans').trigger('click');
        }
        timedata = minutes + ':' + seconds;
    }, 1000);
}

var numbers = {
    0: '০',
    1: '১',
    2: '২',
    3: '৩',
    4: '৪',
    5: '৫',
    6: '৬',
    7: '৭',
    8: '৮',
    9: '৯'
};

function replaceNumbers(input) {
    var output = [];
    for (var i = 0; i < input.length; ++i) {
        if (numbers.hasOwnProperty(input[i])) {
            output.push(numbers[input[i]]);
        } else {
            output.push(input[i]);
        }
    }
    return output.join('');
}

jQuery(document).ready(function() {
    jQuery("#facebook").load("login/facebook");
    jQuery("#google").load("login/google");
});


$(document).on('click', '#saveImgdata', function(e) {
    e.preventDefault();
    // var files = $('#profile_photo').prop('files')[0];
    // var photo = new FormData();
    // photo.append('file', files);
    var photo = new FormData($("#imgDataForm")[0]);
    console.log('Click to upload photo.')
    $.ajax({
        type: 'POST',
        url: 'logged-user.php',
        data: photo,
        contentType: false,
        processData: false,
        dataType: 'json',
        success: function(response) {
            if (response.error) {
                console.log(response.message);
                toastr.error(response.message);
            } else {
                console.log(response.message);
                console.log('Successfully uploaded photo.');
                $('#imgChangeModal').modal('hide');
                setTimeout(function() {
                    location.reload();
                }, 2000);
                toastr.success(response.message);
            }

        }
    });
});

$(document).on('click', '#savePassdata', function(e) {
    e.preventDefault();
    console.log('Click to update password.')
    var password = $('#passDataForm').serialize();
    console.log(password);
    $.ajax({
        type: 'POST',
        url: 'logged-user.php',
        data: password,
        dataType: 'json',
        success: function(response) {
            if (response.error) {
                console.log(response.message);
                toastr.error(response.message);
            } else {
                console.log(response.message);
                console.log('Successfully updated password.');
                $('#passChangeModal').modal('hide');
                setTimeout(function() {
                    location.reload();
                }, 2000);
                toastr.success(response.message);
            }

        }
    });
});

$(document).on('click', '#saveNamedata', function(e) {
    e.preventDefault();
    console.log('Click to update Name.')
    var name = $('#nameDataForm').serialize();
    console.log(name);
    $.ajax({
        type: 'POST',
        url: 'logged-user.php',
        data: name,
        dataType: 'json',
        success: function(response) {
            if (response.error) {
                console.log(response.message);
                toastr.error(response.message);
            } else {
                console.log(response.message);
                console.log('Successfully updated name.');
                $('#nameChangeModal').modal('hide');
                setTimeout(function() {
                    location.reload();
                }, 2000);
                toastr.success(response.message);
            }

        }
    });
});
$(document).on('click', '#saveEmaildata', function(e) {
    e.preventDefault();
    console.log('Click to update Email.')
    var email = $('#emailDataForm').serialize();
    console.log(name);
    $.ajax({
        type: 'POST',
        url: 'logged-user.php',
        data: email,
        dataType: 'json',
        success: function(response) {
            if (response.error) {
                console.log(response.message);
                toastr.error(response.message);
            } else {
                console.log(response.message);
                toastr.success(response.message);
                console.log('Successfully updated email.');
                $('#emailChangeModal').modal('hide');
                setTimeout(function() {
                    location.reload();
                }, 2000);
            }

        }
    });
});