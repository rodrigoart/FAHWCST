const { createApp  } = Vue

createApp({
  data() {
    return {
      empresas: [],
      contractorNotes: false,
      Address: `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.stateAbbr()},  ${faker.address.country()}`,
      titleLocal:  true,
      titleOutside:  true,
      contractorAssigned:  false,
      contractorAssignedId: 0,
    }
  },

  methods: {


    copiarTabla() {

      let datos = '';

      this.empresas.forEach((empresa) => {
        datos += empresa.disponibilidad ? this.getTitleArea(empresa) : ``;
        datos += this.getEmpresa(empresa) + this.getAppmt(empresa) + this.getAdditionalInfo(empresa);
      });

      // Copiar datos al portapapeles
      const el = document.createElement('textarea');
      el.value = datos;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      if(datos) {
        Swal.fire({
          icon: 'success',
          title: 'Search Note Created!',
          showConfirmButton: false,
          timer: 2000,
          footer: 'Now you can paste it on falcon!'
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Note Not Created',
          text: 'You need at least one contractor on the list!',
        })
      }


      this.titleLocal = true;
      this.titleOutside = true;
    },

    contractorNote() {
      let tekNote = '';

      this.empresas.forEach((empresa) => {
        if(empresa.toAssign){
          tekNote += `Dear ${empresa.nombre} \n`;
          tekNote += `As our prior conversation, you agreed to service this work order \n`;
          tekNote += this.getAppmt(empresa);
          tekNote += `Please be kind and call the customer as soon as you can. \n`;
          tekNote += `Thank you for your partnership`;
        }

      // Copiar datos al portapapeles
      const el = document.createElement('textarea');
      el.value = tekNote;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      });

      if(tekNote) {
        Swal.fire({
          icon: 'success',
          title: 'Contractor Note Created!',
          showConfirmButton: false,
          timer: 2000,
          footer: 'Now you can paste it on falcon!'
        })
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Note Not Created',
          text: 'You need a contractor assigned!',
        })
      }
    },

    getEmpresa(empresa) {
      if(empresa.disponibilidad) {
        return `${empresa.nombre} -> ${empresa.disponibilidad}\n`;
      }else{
        return ``;
      }
    },

    getAppmt(empresa) {
      let appmtText = '';
      if(empresa.appmt){
        appmtText += `Appointment: ${empresa.appmt}`;
        if(empresa.time1) {
          appmtText += ` From: ${empresa.time1}`;
          if(empresa.time2) {
            appmtText += ` To: ${empresa.time2}`
          }else{
            appmtText += ` To: Open time`;
          }
        }
        return appmtText + `\n`;
      }else{
        return  ``;
      }
    },

    getAdditionalInfo(empresa) {
      return empresa.informacion ? `Additonal Information: ${empresa.informacion}\n` : ``;
    },

    getTitleArea(empresa) {
      if(empresa.area == "Local" && this.titleLocal){
        this.titleLocal = !this.titleLocal;
        return  `Local Area Contractors:\n`;
      }
      if(empresa.area == "Outside" && this.titleOutside){
        this.titleOutside = !this.titleOutside;
        return  `\nOutside Area Contractors:\n`;
      }
      return ``;
    },

    reloadPage() {
      location.reload()
    },

    scrollToTop() {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },

    showNotes() {
      this.contractorNotes = !this.contractorNotes;
    },

    changeDisponibilidad(empresa) {
      empresa.available = (empresa.disponibilidad=='Available') ? true : false
      if(empresa.disponibilidad=='Assigned!') {
        empresa.toAssign = true;
        this.contractorAssigned = true;
        this.contractorAssignedId = empresa.id;
      }else{
        empresa.toAssign = false;
        this.contractorAssigned = false;
        this.contractorAssignedId = 0;
      }
    },

    moveAddInfo(empresa) {
      if(empresa.disponibilidad=='Available' || empresa.disponibilidad=='Assigned!') {
        return true;
      }
    },

    },


  mounted(){
    for (let i = 0; i < faker.random.number({min:4, max:11}); i++) {
      const id = faker.random.number({min: 10000000, max: 99999999})
      const nombre = faker.company.companyName();
      const telefono1 = faker.phone.phoneNumberFormat();
      const telefono2 = faker.phone.phoneNumberFormat();
      const telefono3 = faker.phone.phoneNumberFormat();
      const notas = faker.lorem.paragraphs(3);
      const notas2 = faker.lorem.paragraphs(2);
      const area = (faker.random.number({min:1, max:100})%2==0) ? 'Local' : 'Outside'
      const disponibilidad = "";
      const informacion = "";
      const appmt = "";
      const time1 = "";
      const time2 = "";
      const available = false;
      const assigned = false;
      const toAssign = false;

      this.empresas.push({
        id,
        nombre,
        telefono1,
        telefono2,
        telefono3,
        notas,
        notas2,
        area,
        disponibilidad,
        informacion,
        appmt,
        time1,
        time2,
        available,
        assigned,
        toAssign,
      });
    }

    this.empresas.sort((a, b) => {
      if (a.area < b.area) {
        return -1;
      }
      if (a.area > b.area) {
        return 1;
      }
      return 0;
    });

    this.empresas[faker.random.number({min:0, max:3})].assigned = true;

  }

}).mount('#app')
