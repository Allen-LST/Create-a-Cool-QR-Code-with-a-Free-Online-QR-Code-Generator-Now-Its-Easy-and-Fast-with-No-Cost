function sharePage(e) {
  e.preventDefault();
  if (navigator.share) {
    navigator.share({
      title: document.title,
      text: "Membuat Kode QR Secara Gratis, Mudah, Dan Cepat Hanya Di LST QR Generator:",
      url: window.location.href
    }).catch(console.error);
  } else {
    alert('Your browser not support share option');
  }
}