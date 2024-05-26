async function simul(){
	const response = await fetch(`/varsimulados`)
	const rr = await response
	if(!rr) return false
	return rr.json()
}

let gebi = x => document.getElementById(x)

async function add(completename, turma, simulado, questions){
	if(!completename || !turma || !simulado || !questions) return false
	const response = await fetch(`/setsimulado?completename=${completename}&turma=${turma}&simulado=${simulado}&answers=${questions}`)
	console.log("addded")
	const rr = await response
	if(!rr) return false
	return rr.json()
}

document.addEventListener('DOMContentLoaded', function() {
	simul().then(simulados => {
		for(var i = 0; i < simulados.length; i++){
			let opt = document.createElement("option")
			opt.value = simulados[i].id
			opt.innerText = simulados[i].name
			gebi("simulado").appendChild(opt)
		}

		const simuladoSelect = gebi('simulado');
		preencher(simulados.find(simulado => simulado.id === simuladoSelect.value))
		simuladoSelect.addEventListener('change', function() {
			preencher(simulados.find(simulado => simulado.id === simuladoSelect.value))
		});

		const selectElements = document.querySelectorAll('#tbody select');

		selectElements.forEach((select, index) => {
			select.addEventListener('change', () => {
				const nextSelect = selectElements[index + 1];
				if (nextSelect) {
					nextSelect.focus();
				}
				select.classList.add('selected')
			})
		})

		let turma = gebi("turma")
	
		async function preencher(simulado){
			let turma = gebi("turma")
			for(var i = 0; i < simulado.turmas.length; i++){
				let opt = document.createElement("option")
				opt.value = simulado.turmas[i]
				opt.innerText = simulado.turmas[i]+"° ano"
				turma.appendChild(opt)
			}
		
			console.log(simulado)
			const tbody = gebi("tbody")
		
			for(var i = 0; i < simulado.questions; i++){
				let tr = document.createElement("tr")
				let td1 = document.createElement("td")
				let td2 = document.createElement("td")
			
				let label = document.createElement("label")
				label.id = `labelanswers${i+1}`
				label.innerHTML = `Questão ${i+1}`
				label.setAttribute("for", `selectanswers${i+1}`)
				let select = document.createElement("select")
				select.id = `selectanswers${i+1}`
				select.classList.add("selectanswers")
				var optS = document.createElement("option")
				optS.value = ""
				optS.innerText = "Selecione"
				var optA = document.createElement("option")
				optA.value = "A"
				optA.innerText = "A"
				var optB = document.createElement("option")
				optB.value = "B"
				optB.innerText = "B"
				var optC = document.createElement("option")
				optC.value = "C"
				optC.innerText = "C"
				var optD = document.createElement("option")
				optD.value = "D"
				optD.innerText = "D"
				var optE = document.createElement("option")
				optE.value = "E"
				optE.innerText = "E"
				var optN = document.createElement("option")
				optN.value = "N"
				optN.innerText = "N"
				select.appendChild(optS)
				select.appendChild(optA)
				select.appendChild(optB)
				select.appendChild(optC)
				select.appendChild(optD)
				select.appendChild(optE)
				select.appendChild(optN)

				td1.appendChild(label)
				td2.appendChild(select)
				tr.appendChild(td1)
				tr.appendChild(td2)
				gebi("tbody").appendChild(tr)
			}
		}

		let form = gebi("formcadastro")
		form.addEventListener('submit', function(event) {
			event.preventDefault();
			let name = gebi("completename").value
			let turmaa = Number(gebi("turma").value)
			let simulado = gebi("simulado").value

			let questions = document.querySelectorAll("#tbody select")
			if(questions.length < simulados.find(simulado => simulado.id === simuladoSelect.value).questions) return alert("Insira todas as questões para enviar! As sem resposta, marque como N.")

			let arranswers = []
			for(var i = 0; i < questions.length; i++){
				arranswers.push(questions[i].value)
			}

			add(name, turmaa, simulado, arranswers.join("")).then(response => {
				if(response){
					if(response.success){
						alert("Enviado com sucesso.")
						window.location.href = window.location.href
					}else{
						console.log(response.reason)
						alert("Erro ao enviar. CODE: NO RESPONSE.SUCCESS")
					}
				}else{
					alert("Erro! CODE: NO RESPONSE")
				}
			})
		})
	})
})