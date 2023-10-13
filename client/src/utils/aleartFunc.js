import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';

// confirmMessagge
export const confirmMessagge = async () => {
    return Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        return result.isConfirmed;
    });
}


// showSuccessMessage
export const showSuccessMessage = async (msg) => {
    return Swal.fire({
        title: 'Deleted!',
        text: `${msg}`,
        icon: 'success',
        showConfirmButton: false,
        timer: 2000
    });
}