function empezar(archivo) {
  localStorage.setItem("leccionActual", archivo);
  window.location.href = "leccion.html";
}

// Si estamos en leccion.html
if (window.location.pathname.includes("leccion.html")) {
  let palabras = [];
  let indice = 0;
  let puntaje = 0;
  const leccion = localStorage.getItem("leccionActual") || "data.json";

  fetch(leccion)
    .then(res => res.json())
    .then(data => {
      palabras = data;
      mostrarPregunta();
    });

  const preguntaElem = document.getElementById("pregunta");
  const opcionesElem = document.getElementById("opciones");
  const feedback = document.getElementById("feedback");
  const siguienteBtn = document.getElementById("siguiente");

  function mostrarPregunta() {
    const actual = palabras[indice];
    preguntaElem.textContent = `¿Qué significa "${actual.palabra}"?`;
    opcionesElem.innerHTML = "";
    feedback.textContent = "";
    siguienteBtn.style.display = "none";

    const opciones = generarOpciones(actual.significado);
    opciones.forEach(op => {
      const btn = document.createElement("button");
      btn.textContent = op;
      btn.className = "opcion";
      btn.onclick = () => verificar(op, actual.significado);
      opcionesElem.appendChild(btn);
    });
  }

  function generarOpciones(correcta) {
    const opciones = [correcta];
    while (opciones.length < 4) {
      const rand = palabras[Math.floor(Math.random() * palabras.length)].significado;
      if (!opciones.includes(rand)) opciones.push(rand);
    }
    return opciones.sort(() => Math.random() - 0.5);
  }

  function verificar(seleccion, respuesta) {
    if (seleccion === respuesta) {
      feedback.textContent = "✅ ¡Correcto!";
      puntaje++;
    } else {
      feedback.textContent = `❌ Incorrecto. Era: ${respuesta}`;
    }
    siguienteBtn.style.display = "inline-block";
    document.querySelectorAll(".opcion").forEach(b => b.disabled = true);
  }

  siguienteBtn.addEventListener("click", () => {
    indice++;
    if (indice < palabras.length) {
      mostrarPregunta();
    } else {
      guardarProgreso();
      preguntaElem.textContent = `Lección completada 🎉 Tu puntaje: ${puntaje}/${palabras.length}`;
      opcionesElem.innerHTML = "";
      feedback.textContent = "";
      siguienteBtn.style.display = "none";
    }
  });

  function guardarProgreso() {
    localStorage.setItem(`puntaje_${leccion}`, puntaje);
  }
}

// Mostrar progreso en index.html
if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
  const progresoElem = document.getElementById("progreso");
  const l1 = localStorage.getItem("puntaje_data.json");
  const l2 = localStorage.getItem("puntaje_data2.json");
  let texto = "";
  if (l1) texto += `📖 Lección 1: ${l1} puntos<br>`;
  if (l2) texto += `👋🏾 Lección 2: ${l2} puntos`;
  progresoElem.innerHTML = texto;
}
