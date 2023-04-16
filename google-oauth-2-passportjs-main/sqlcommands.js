var sql = require('./databasepg');
const forecast = require("./build/Release/forecast.node");

async function cppanswer(id, data, eat, time) 
{
  // return variable
  const obj = {};

  //get felh_id
  felh_id = await sql.client.query(`SELECT felh_id FROM public."felhasznalo" WHERE google_id like $1`,
    [id.id]).catch(console.error());

  //insert new data to modell_futas
  await sql.client.query(`INSERT INTO public."modell_futas" 
                        (felh_id, etkezes_kezd, etkezes_tipus, zsir_g, feherje_g,
                        rost_g, indulo_vercukor, inzulin_dozis)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [felh_id.rows[felh_id.rowCount - 1]["felh_id"], data.start_eat, data.eat_type, data.fat, data.protein,
    data.fiber, data.baselineBGL,
    data.insulinQuantity]).catch(console.error());

  //get futas_id
  futas_id = await sql.client.query(`SELECT futas_id, futas_kezd FROM public."modell_futas" WHERE felh_id = $1 ORDER BY futas_kezd`,
    [felh_id.rows[felh_id.rowCount - 1]["felh_id"]]).catch(console.error());


  const gicar = [];

  eat.forEach(function (element) {

    gicar.push({ gi: element.gi, carbohydrate: element.carbohydrate });

    sql.client.query(`INSERT INTO public."futas_gi" (futas_id, gi_szazalek, szenh_g) VALUES ($1, $2, $3)`,
      [futas_id.rows[futas_id.rowCount-1]["futas_id"], element.gi, element.carbohydrate]).catch(console.error());

  });

  array_size = Math.round(time.period / time.rate);
  result = forecast.forecast(array_size, data.fat, data.protein, data.fiber, data.baselineBGL, data.insulinQuantity);

  result_float = [];
  for (i = 0; i < array_size - 1; i++) {
    result[i] = parseInt(result[i] * 100);
    result_float[i] = parseFloat(result[i] / 100);
  }
  
  timespace = [];
  for (i = 0; i < array_size - 1; i++) {
    if (i == 0) {
      timespace[i] = time.rate;
    }
    else {
      timespace[i] = timespace[i - 1] + time.rate;
    }
  }
  
  timespace.forEach((data2, index) => {
    obj[data2] = result_float[index];
  });
  
  return obj;
}
module.exports = { cppanswer };