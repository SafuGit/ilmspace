import Swal from "sweetalert2";

const baseConfig = {
  background: "#1f2329",
  color: "#ffffff",
  confirmButtonColor: "#D4AF37",
  cancelButtonColor: "#4A6C6F",
  iconColor: "#D4AF37",
  customClass: {
    popup: "!rounded-2xl !border !border-[#292e38] !shadow-2xl",
    title: "!text-white !font-bold !text-2xl",
    htmlContainer: "!text-[#9da6b8] !text-base",
    confirmButton:
      "!bg-[#D4AF37] !text-[#111318] !font-bold !px-6 !py-3 !rounded-lg !transition-all hover:!bg-[#c49d2f] !shadow-md",
    cancelButton:
      "!bg-[#4A6C6F] !text-white !font-bold !px-6 !py-3 !rounded-lg !transition-all hover:!bg-[#3d5a5d] !shadow-md",
  },
};

export const alert = {
  success: (message: string, title: string = "Success!") => {
    return Swal.fire({
      ...baseConfig,
      icon: "success",
      title,
      text: message,
      confirmButtonText: "OK",
      timer: 3000,
      timerProgressBar: true,
    });
  },

  error: (message: string, title: string = "Error!") => {
    return Swal.fire({
      ...baseConfig,
      icon: "error",
      title,
      text: message,
      confirmButtonText: "OK",
      iconColor: "#ef4444",
    });
  },

  confirm: async (
    message: string,
    title: string = "Are you sure?",
    confirmText: string = "Yes, proceed",
    cancelText: string = "Cancel"
  ): Promise<boolean> => {
    const result = await Swal.fire({
      ...baseConfig,
      icon: "warning",
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      reverseButtons: true,
      iconColor: "#f59e0b",
    });

    return result.isConfirmed;
  },

  info: (message: string, title: string = "Info") => {
    return Swal.fire({
      ...baseConfig,
      icon: "info",
      title,
      text: message,
      confirmButtonText: "OK",
      iconColor: "#4A6C6F",
    });
  },

  loading: (message: string = "Please wait...") => {
    return Swal.fire({
      ...baseConfig,
      title: message,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  },

  close: () => {
    Swal.close();
  },
};
