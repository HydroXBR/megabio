import axios from 'axios'/**/
import { join, basename, dirname } from "path"
import * as path from 'path'
import { fileURLToPath } from 'url';
const { token } = process.env
import express from 'express'
import cors from 'cors'
const app = express()
const { PORT } = process.env
import bodyParser from "body-parser"
const __dirname = dirname(fileURLToPath(import.meta.url))
import user from "./database/user.js"
import useradm from "./database/useradm.js"
import simuladoo from "./database/simulado.js"
import old from "./database/simulado02.js"
import Db from "mongodb"
import im from "./db_connect.js"
const ec = txt => encodeURIComponent(txt)
const dec = txt => decodeURIComponent(txt)
var simulados = [
	{
		name: "2° Simulado MEGABIO 2024", 
		description: "DNA da Aprovação",
		model: "megabio",
		date: "28-08-2024",
		id: "MBIO2",
		organization: [{materia: "ndv", q:10, name: "Núcleo e Divisão"},{materia: "ben", q:10, name: "Bioenergética"},{materia: "gen", q:10, name: "Genética"},{materia: "bot", q:10, name: "Botânica"},{materia: "emb", q:5, name: "Embriologia"}],
		special: [0, 11, 22, 33, 44],
		matspecial: [
			{ materia: "Núcleo e Divisão", special: 0 },
			{ materia: "Bioenergética", special: 11 },
			{ materia: "Genética", special: 22 },
			{ materia: "Botânica", special: 33 },
			{ materia: "Embriologia", special: 44 }
		]
		,
		intervals: {
			ndv: [1, 10],
			ben: [11, 20],
			gen: [21, 30],
			bot: [31, 40],
			emb: [41, 45]
		},
		turmas: [1],
		answers: [
			{
				turma:1,
				respostas:["D","D","E","B","C","D","B","B","D","D","C","C","B","A","E","A","A","E","A","C","A","E","B","D","C","D","B","E","B","E","B","C","E","C","E","C","D","A","E","C","C","A","B","E","C"]
			}
		],
		questions: 45
	},
	{
		name: "1° Simulado MEGABIO 2024", 
		description: "DNA da Aprovação",
		model: "megabio",
		date: "26-05-2024",
		id: "MBIO1",
		organization: [{materia: "cit", q:12, name: "Citologia"},{materia: "ben", q:9, name: "Bioenergética"},{materia: "fisio", q:24, name: "Fisiologia"}],
		special: [0, 13, 23],
		matspecial: [
			{ materia: "Citologia", special: 0 },
			{ materia: "Bioenergética", special: 13 },
			{ materia: "Fisiologia", special: 23 }
		]
		,
		intervals: {
			cit: [1, 12],
			ben: [13, 21],
			fisio: [22, 45]
		},
		turmas: [1],
		answers: [
			{
				turma:1,
				respostas:["C","E","E","E","D","E","D","E","E","E","B","C","B","E","E","B","E","A","C","A","C","D","E","A","B","C","A","B","E","B","E","E","E","C","D","D","A","B","A","E","B","D","D","E","C"]
			}
		],
		questions: 45
	}
]
const fetch = s => import('node-fetch').then(({default: fetch}) => fetch(s))
im()

/*old.find().then(users => {
	users.forEach(userr =>{
		const novoSimulado = new simuladoo({
			completename: userr.name,
			turma: userr.turma,
			simulado: "022024",
			answers: userr.answers,
			registered: new Date().getTime()
		});

		novoSimulado.save().then(() => {
			console.log("success: " + userr.name)
			}).catch(error => {
				console.error(`Erro ao cadastrar ${userr.name}:`, error)
			})
	})
})*/

function round(num, scale) {
	if(!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + scale)  + "e-" + scale);
	} else {
		var arr = ("" + num).split("e");
		var sig = ""
		if(+arr[1] + scale > 0) {
			sig = "+";
		}
		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
	}
}

const headers = /** @type {import("http").OutgoingHttpHeaders} */ ({
		"Access-Control-Allow-Origin": "https://brainly.com.br",
	"Access-Control-Allow-Methods":"GET",
	"Access-Control-Allow-Headers":"X-Api-Token"
})

app.use(
	cors({ 
		exposedHeaders: [
			'Authorization'
		]
	}),
	bodyParser.json(),
	bodyParser.urlencoded({
		extended: true
	}),
	express.static(path.join(__dirname, '/interface'))
);

app.listen(PORT, () => {console.log(`Listening at ${PORT}`)})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/interface'));

// Website pages
app.get('/',function(req,res) {
	console.log("Access PRINCIPAL: "+ new Date())
	res.sendFile(__dirname + '/interface/ranking?id=MBIO1')
})

app.get('/#',function(req,res) {
	console.log("Access PRINCIPAL: "+ new Date())
	res.sendFile(__dirname + '/interface/ranking?id=MBIO1')
});


app.get('/cadastroadmin',function(req,res) {
	console.log("Access ADMIN, Cadastro: "+ new Date())
	res.sendFile(__dirname + '/interface/cadastroadmin.html')
})


app.get('/simuladoadm',function(req,res) {
	console.log("Access ADMIN SIMULADOS: "+ new Date())
	res.sendFile(__dirname + '/interface/simuladoadm.html')
});

app.get('/simuladosbank.js',function(req,res) {
	console.log("Access ADMIN SIMULADOS/: "+ new Date())
	res.sendFile(__dirname + '/interface/simuladosbank.js')
});

app.get('/ranking',function(req,res) {
	console.log("Access RANKING: "+ new Date())
	res.sendFile(__dirname + '/interface/ranking.html')
});

app.get('/desempenho',function(req,res) {
	console.log("Access DESEMPENHO: "+ new Date())
	res.sendFile(__dirname + '/interface/desempenho.html')
});

app.get('/varsimulados',function(req,res) {
	console.log("Access SYSTEM SIMULADOS: "+ new Date())
	res.json(simulados)
});

app.get('/simulados',function(req,res) {
	res.sendFile(__dirname + '/interface/simulados.html')
});

app.get('/src',function(req,res) {
	let urlparsed = "https://metodosimulados.yeshayahudesigndeveloper.repl.co" + req._parsedOriginalUrl.href
	let required = new URL(urlparsed).searchParams.get('id') || res.sendStatus(404)
	let format = new URL(urlparsed).searchParams.get('format') || "png"


	res.sendFile(__dirname + `/src/${required}.${format}`)
})


app.get('/getalunobyid', async (req, res) => {
	const id = req.query.id;

	if(!id){
		res.status(400).send('Missing parameters.');
		return;
	}

	useradm.findOne({ _id: id }, (err, user) => {
		if(err){
			res.status(404).send({success:false, message:"err"})
		}else{
			if(!user) return res.status(404).send({success:false, message:"not found"})
			res.status(200).send(user)
		}
	})
});

app.get('/setpago', async (req, res) => {
	const id = req.query.id;
	const mes = req.query.mes;
	const set = req.query.set;

	if (!id || !mes || !set) {
		return res.status(400).send('Missing parameters.');
	}

	try {
		const user = await useradm.findOne({ _id: id });
		
		if (!user) {
			return res.status(404).send('User not found.');
		}
		
		let pgtos = user.pgto
		
		if(pgtos.length > 0){
			let mespgto = user.pgto.find(u => u.mes == mes)
			if(mespgto){
				mespgto.pago = set
				await user.save()
			}else{
				let ar = {mes: mes, pago: set}
				user.pgto.push(ar)
				await user.save()
			}
		}else{
			let ar = {mes: mes, pago: set}
			user.pgto.push(ar)
			await user.save()
		}

		return res.status(200).send({ success: true, reason: "Pagamento setado com sucesso!" });
	}catch(err){
		console.error(err);
		return res.status(500).send('Internal Server Error.');
	}
})



app.get('/checkname', function(req, res) {
	const { name } = req.query;

	if (!name) {
		return res.send({ success: false, reason: "Missing parameters" });
	}

	user.findOne({ completename: name }, (err, usuario) => {
		if (err) {
			console.log(err);
			return res.status(500).send({ success: false, reason: "Internal server error" });
		}

		if (usuario) {
			res.send({
				success: true, 
				reason: "User already exists.", 
				user: {
					email: usuario.email, 
					completename: usuario.completename
				} 
			});
		} else {
			res.send({ success: true, reason: "User not found"});
		}
	})
})

app.get('/checkcpf', function(req, res) {
	const { cpf } = req.query;

	if (!cpf) {
		return res.send({ success: false, reason: "Missing parameters" });
	}

	user.findOne({ cpf: cpf }, (err, usuario) => {
		if (err) {
			console.log(err);
			return res.status(500).send({ success: false, reason: "Internal server error" });
		}
	
		if (usuario) {
			res.send({
				success: true, 
				reason: "User already exists.", 
				user: {
					email: usuario.email, 
					profilePicture: usuario.profilePicture, 
					permissions: usuario.permissions, 
					completename: usuario.completename
				} 
			});
		} else {
			res.send({ success: true, reason: "CPF not found"});
		}
	})
})

app.get('/checkname', function(req, res) {
	const { name } = req.query;

	if (!name) {
		return res.send({ success: false, reason: "Missing parameters" });
	}

	useradm.findOne({ completename: name }, (err, usuario) => {
		if (err) {
			console.log(err);
			return res.status(500).send({ success: false, reason: "Internal server error"});
		}

		if (usuario) {
			res.send({
				success: true, 
				reason: "User already exists.", 
				user: {
					completename: usuario.completename
				} 
			});
		} else {
			res.send({ success: true, reason: "Aluno not found"});
		}
	})
})

app.get('/logar', function(req, res) {
	const { email, senha } = req.query;

	if (!email || !senha) {
		return res.send({ success: false, reason: "Missing parameters" });
	}

	user.findOne({ email: email }, (err, usuario) => {
		if (usuario) {
			if(usuario.senha === senha){
				res.send({
					success: true, 
					reason: "Success at login", 
					user: {
						email: usuario.email, 
						profilePicture: usuario.profilePicture, 
						permissions: usuario.permissions, 
						completename: usuario.completename
					} 
				});
			}else{
				res.send({ success: false, reason: "Wrong password" })
			}
		} else {
				res.send({ success: false, reason: "User not found." });
			}
	});
})

app.get('/setsimulado', function(req, res) {
	const { completename, turma, simulado, answers } = req.query

	if (!completename || !turma || !answers || !simulado) {
		return res.send({ success: false, reason: "Missing parameters" })
	}

	const novoSimulado = new simuladoo({
		completename: completename,
		turma: turma,
		simulado: simulado,
		answers: answers,
		registered: new Date().getTime()
	});

	novoSimulado.save().then(() => {
		res.send({ success: true, reason: "success" })
		}).catch(error => {
			console.error("Erro ao cadastrar:", error)
			res.send({ success: false, reason: error })
		})
})

app.get('/deleteadmin', async function(req, res) {
	console.log("Access ADMIN DELETE: " + new Date())
	const { id } = req.query 

	if (req.query.token == process.env.token2) {
		try {
			const userremove = await useradm.findOneAndDelete({ _id: id });

			if (!userremove) {
				return res.status(404).send({success: false, message: "User not found."});
			}

			res.status(200).send({success: true, message: "User has been deleted."});
		}catch(e){
			console.error('Erro ao apagar usuário:', e);
			res.status(500).send({success:false, message:"Error."});
		}
	} else {
		res.status(401).send({success:false, message:"Unauthorized"});
	}
});

app.get('/cadastraradmin', function(req, res) {
	const { completename, nascimento, email, responsavel, rgresp, cpfresp, telresp, telal, endereco, bairro, cep, dia, camisa, bolsista, turma } = req.query;
	console.log(req.query);

	/*if(!completename || !nascimento || !email || !responsavel || !rgresp || !cpfresp || !telresp || !endereco || !bairro || !cep || !dia || !camisa || !bolsista || !turma) return res.send({ success: false, reason: "Missing parameters" })*/

	const novoUser = new useradm({
		completename: completename,
		nascimento: nascimento,
		email: email,
		responsavel: responsavel,
		rgresp: rgresp,
		cpfresp: cpfresp,
		telresp: telresp,
		telal: telal,
		endereco: endereco,
		bairro: bairro,
		cep: cep,
		dia: dia,
		camisa: camisa,
		bolsista: bolsista,
		turma: Number(turma),
		pagamentos: [{jan: false, fev: false, mar: false, abr: false, mai: false, jun: false, jul: false, ago: false, set: false, out: false, nov: false, dez: false}],
		registered: new Date().getTime()
	});

	novoUser.save()
		.then(() => {
			res.send({ success: true, reason: "Success", user: { completename: completename}
			});
		})
		.catch(error => {
			console.error("Erro ao cadastrar:", error);
			res.send({ success: false, reason: "Error" });
		});
});

app.get('/saveadmin', async function(req, res) {
	const { id, completename, nascimento, email, responsavel, rgresp, cpfresp, telresp, telal, endereco, bairro, cep, dia, camisa, bolsista, turma } = req.query;
	console.log(req.query);

	if(!id || !completename || !nascimento || !email || !responsavel || !rgresp || !cpfresp || !telresp || !endereco || !bairro || !cep || !dia || !camisa || !bolsista || !turma) return re.send({ success: false, reason: "Missing parameters" })

	try {
		const u = await useradm.findOne({ _id: id });
		if (!u) {
			return res.status(404).send("User not found");
		}

		let different = []
		if(u.completename != completename) different.push("completename")
		if(u.nascimento != nascimento) different.push("nascimento")
		if(u.email != email) different.push("email")
		if(u.responsavel != responsavel) different.push("responsavel")
		if(u.rgresp != rgresp) different.push("rgresp")
		if(u.cpfresp != cpfresp) different.push("cpfresp")
		if(u.telresp != telresp) different.push("telresp")
		if(u.telal != telal) different.push("telal")
		if(u.endereco != endereco) different.push("endereco")
		if(u.bairro != bairro) different.push("bairro")
		if(u.cep != cep) different.push("cep")
		if(u.dia != dia) different.push("dia")
		if(u.camisa != camisa) different.push("camisa")
		if(u.bolsista != bolsista) different.push("bolsista")
		if(u.turma != turma) different.push("turma")

		if(different.length == 0) return res.send({success: true, message: "Nothing changed"})
		if(different.length > 0){
			for(var i = 0; i < different.length; i++){
				u[different[i]] = req.query[different[i]]
			}
			await u.save()
			res.send({success:true, message:"Successfully changed"})
		}
		
	} catch (err) {
		
	}
});

app.get('/apiranking', function(req,res) {
	let { id } = req.query
	let sell = req.query.sel 
	function sortfunction(a, b){
		return (a - b)
	}

	const sel = !isNaN(Number(sell)) ? Number(sell) : "general"

	let simuatual = simulados.find(e => e.id == id)

	simuladoo.find().then(e => {
		const rrr = e.filter(j => j.simulado == id)
		let r;
		if(sel > 3){
			r = rrr.filter(us => us.turma == 4 || us.turma == 5 || us.turma == 6)
		}else if(sel == 1 || sel == 2 || sel == 3){
			r = rrr.filter(us => us.turma == sel)
		}else{
			r = rrr.filter(us => us.turma == 1 || us.turma == 2 || us.turma == 3 || us.turma == 4 || us.turma == 5 || us.turma == 6)
		}

		const array = new Array;
		const usersArray = new Array;

		for(var t = 0; t < r.length; t++){
			let answers1 = simuatual.answers.find(e => e.turma == 1) ?  simuatual.answers.find(e => e.turma == 1).respostas : simuatual.answers.find(e => e.turma == 1)

			let answersel;
			if(Number(r[t].turma) == 1) answersel = answers1

			let arranswers = r[t].answers.split("")

			let pontosPorMateria = {}
			let materiasParaAdicionar = []

			for (let i = 0; i < simuatual.organization.length; i++) {
				let materia = simuatual.organization[i].materia
				materiasParaAdicionar.push(materia)
			}
			for (let i = 0; i < materiasParaAdicionar.length; i++) {
				let materia = materiasParaAdicionar[i];
				pontosPorMateria[materia] = 0;
			}

			let pontos = 0;

			let intervals = simuatual.intervals;

			for (var i = 0; i < simuatual.questions; i++) {
				if (arranswers[i] == answersel[i] || answersel[i] == "X") {
					pontos++;
					for (const [key, value] of Object.entries(intervals)) {
						if (i + 1 >= value[0] && i + 1 <= value[1]) {
							pontosPorMateria[key]++;
							break;
						}
					}
				}
			}

			function g(fullName) {
				const words = fullName.trim().split(/\s+/);

				const firstName = words[0]; 
				const secondName = words[1];

				if(secondName){
				if (["de", "da", "dos", "das", "do", "henrique", "luiza"].includes(secondName.toLowerCase())) {
					if (["de", "da", "dos", "das", "do"].includes(words[2].toLowerCase())) {
						return `${firstName} ${secondName} ${words[2]} ${words[3]}`;
					} else {
						return `${firstName} ${secondName} ${words[2]}`;
					}
				}
				}
				return `${firstName} ${secondName}`;
			}
			const u = {
				user: {
					name: g(r[t].completename.replace(/\|(.+)$/,"")),
					completename: r[t].completename,
					turma: Number(r[t].turma) >= 4 ? Number(r[t].turma) - 3 : r[t].turma,
					pont: pontos,
					letras: r[t].answers.split(""),
					percent: round(pontos/simuatual.questions*100,1),
					id: r[t]._id,
					simulado: simuatual
				}
			}

			for (let i = 0; i < simuatual.organization.length; i++) {
				let materia = materiasParaAdicionar[i];
				u.user[materia] = pontosPorMateria[materia]
			}

			for (var key in u) {
				array.push(u[key]);
			}

			if(sel < 4){
				array.sort(function(a, b){
					return (b.pont) - (a.pont) || a.name.localeCompare(b.name)
			 })
			}else{
				array.sort(function(a, b){
					return a.name.localeCompare(b.name)
			 })
			}

			for (var i = 0; i < array.length; i++) {
				array[i].rank = i + 1;
			}
		}
		res.send(array)
	})
})
