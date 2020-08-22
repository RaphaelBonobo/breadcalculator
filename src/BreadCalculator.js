import React from 'react';
import './App.css';
import data from './data/RecettesLevain.json' // Import d'une variable data qui contient le fichier JSON
import dataLevure from './data/RecettesLevure.json'
import {Table , TableBody , TableCell , TableRow , TableContainer , TableHead , Paper , Switch , FormControlLabel , TextField} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete';

let ingredientsLevain = ["Farine", "Eau", "Sel", "Levain"]
let ingredientsLevure = ["Farine", "Eau", "Sel", "Levure"]

function IngredientTable(props){

  let percentFarine = parseInt(props.chosenRecipe.Farine) , percentEau = parseInt(props.chosenRecipe.Eau) , percentSel = parseInt(props.chosenRecipe.Sel) , quantiteIng = parseInt(props.poidsIngredient)
  let finalWater = 0 , finalSalt = 0 , finalLe = 0 , finalFlour = 0 , quantiteFarine = 0 , percentLe = 0
  if(props.typeRecette === "Levain"){percentLe = parseInt(props.chosenRecipe.Levain)}else if (props.typeRecette === "Levure"){percentLe = parseInt(props.chosenRecipe.Levure)}

  switch (props.chosenIngredient) {
    case "Farine":
      finalWater = quantiteIng * (percentEau / 100)
      finalSalt = quantiteIng * (percentSel / 100)
      finalLe = quantiteIng * (percentLe / 100)
      finalFlour = quantiteIng
    break;

    case "Sel":
      quantiteFarine = (quantiteIng * 100) / percentSel
      finalWater = quantiteFarine * (percentEau / 100)
      finalSalt = quantiteFarine * (percentSel / 100)
      finalLe = quantiteFarine * (percentLe / 100)
      finalFlour = quantiteFarine
    break;

    case "Eau":
      quantiteFarine = (quantiteIng * 100) / percentEau
      finalWater = quantiteFarine * (percentEau / 100)
      finalSalt = quantiteFarine * (percentSel / 100)
      finalLe = quantiteFarine * (percentLe / 100)
      finalFlour = quantiteFarine
    break;

    case "Levain" || "Levure":
      quantiteFarine = (quantiteIng * 100) / percentLe
      finalWater = quantiteFarine * (percentEau / 100)
      finalSalt = quantiteFarine * (percentSel / 100)
      finalLe = quantiteFarine * (percentLe / 100)
      finalFlour = quantiteFarine
    break;

    default:
      console.log("def")
  }

  return(
    <TableContainer component={Paper}>
      <Table aria-label="simple table final">
        <TableHead>
          <TableRow id='tableListFinal'>
            <TableCell>Recette</TableCell>
            <TableCell align="right">Farine</TableCell>
            <TableCell align="right">Eau</TableCell>
            <TableCell align="right">Sel</TableCell>
            <TableCell align="right">{props.typeRecette}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
              <TableCell>{props.nomRecipe}</TableCell>
              <TableCell align="right">{Math.round(finalFlour)}g</TableCell>
              <TableCell align="right">{Math.round(finalWater)}g</TableCell>
              <TableCell align="right">{Math.round(finalSalt)}g</TableCell>
              <TableCell align="right">{Math.round(finalLe)}g</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )

}

function DynamicTable(props){
  if(props.levain){
    return <span><RecipeDisplayLevain chosenRecipe={props.chosenRecipe} /></span>
  }
  else{
    return <RecipeDisplayLevure chosenRecipe={props.chosenRecipe} />
  }
}

function RecipeDisplayLevain(props){
let row = props.chosenRecipe
    return( <TableContainer component={Paper}>
      <Table aria-label="simple table levain">
        <TableHead>
          <TableRow id='tableListLevain'>
            <TableCell>Recette</TableCell>
            <TableCell align="right">Farine</TableCell>
            <TableCell align="right">Eau</TableCell>
            <TableCell align="right">Sel</TableCell>
            <TableCell align="right">Levain</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
              <TableCell>{row.NomRecette}</TableCell>
              <TableCell align="right">{row.Farine}%</TableCell>
              <TableCell align="right">{row.Eau}%</TableCell>
              <TableCell align="right">{row.Sel}%</TableCell>
              <TableCell align="right">{row.Levain}%</TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function RecipeDisplayLevure(props){
  let rowB = props.chosenRecipe
      return( <TableContainer component={Paper}>
        <Table aria-label="simple table levure">
          <TableHead>
            <TableRow id='tableListLevure'>
              <TableCell>Recette</TableCell>
              <TableCell align="right">Farine</TableCell>
              <TableCell align="right">Eau</TableCell>
              <TableCell align="right">Sel</TableCell>
              <TableCell align="right">Levure</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
                <TableCell>{rowB.NomRecette}</TableCell>
                <TableCell align="right">{rowB.Farine}%</TableCell>
                <TableCell align="right">{rowB.Eau}%</TableCell>
                <TableCell align="right">{rowB.Sel}%</TableCell>
                <TableCell align="right">{rowB.Levure}%</TableCell>
              </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
}

class PetitPain extends React.Component{

  constructor(props) {
    super(props);
    this.state = {value: '' , chosenRecipe:"" , checked:false , validRecipe:false , memRecette:"" , chosenIngredient:"" , checkInput:false , typeRecette:"" , next:false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this); // Création d'un hook spécifique au menu déroulant
    this.toggleChecked = this.toggleChecked.bind(this);
    this.handleIngredientChange = this.handleIngredientChange.bind(this);
  }

  handleChange(event) {
    let valeur = event.target.value

    if(valeur === ""){
      this.setState({checkInput:true})
    }else{
      this.setState({value: valeur , checkInput:false , next:true})
    }
  }

  handleSelectChange(event , value){

    if(this.state.checked){
      let result = data.find(result => result.NomRecette === value.NomRecette) , validity = false // Récupère le changement de selectBox
      if(typeof(result) === "object"){
        validity = true
        this.setState({chosenRecipe:result , validRecipe:validity , memRecette:result.NomRecette , typeRecette:"Levain"})
      }else{
        validity = false
        this.setState({validRecipe:validity})}

    }else{
      let resultBis = dataLevure.find(resultBis => resultBis.NomRecette === value.NomRecette) , validityBis = false
      if(typeof(resultBis) === "object"){
        validityBis = true
        this.setState({chosenRecipe:resultBis , validRecipe:validityBis , memRecette:resultBis.NomRecette , typeRecette:"Levure"})
      }else{
        validityBis = false
        this.setState({validRecipe:validityBis})}
    }
  }

  handleIngredientChange(event , value){
    this.setState({chosenIngredient:value})
  }

  toggleChecked(event){
    if(this.state.checked){this.setState({checked:false})}
    else{this.setState({checked:true})}

    if(this.state.validRecipe === true){
      if(this.state.checked){
        let resultSyncBis = dataLevure.find(resultSyncBis => resultSyncBis.NomRecette === this.state.memRecette)
        this.setState({chosenRecipe:resultSyncBis , typeRecette : "Levure"})
      }else{
        let resultSync = data.find(resultSync => resultSync.NomRecette === this.state.memRecette)
        this.setState({chosenRecipe:resultSync , typeRecette: "Levain"})
        }
      }
  }

  render() {
    const chosenRecipe = this.state.chosenRecipe
    const validRecipe = this.state.validRecipe
    const modeLevain = this.state.checked
    const checkInput = this.state.checkInput
    const typeRecette = this.state.typeRecette
    const poidsIngredient = this.state.value
    const nomRecipe = this.state.memRecette
    const chosen = this.state.chosenIngredient
    const authoNext = this.state.next

    return (
      <div className="App-header">

      <FormControlLabel
      control={<Switch checked={this.state.checked} onChange={this.toggleChecked} />}
      label={modeLevain ? "Mode levain activé!" : "Activer le mode levain?"}
      />

      <p></p>

      <Autocomplete
      id="recette-select"
      options={data}
      getOptionLabel={(option) => option.NomRecette}
      style={{ width: 250 }}
      renderInput={(params) => <TextField {...params} label="Recette" variant="outlined" />}
      color="secondary"
      onChange={this.handleSelectChange}
      />

      <p></p>

      <div>{validRecipe
      ? <DynamicTable levain={modeLevain} chosenRecipe={chosenRecipe} />
      : "Recette non sélectionnée"}</div>

      <p></p>

      <Autocomplete
      id="ingredient-select"
      options={modeLevain ? ingredientsLevain : ingredientsLevure}
      getOptionLabel={(option) => option}
      style={{ width: 250 }}
      renderInput={(params) => <TextField {...params} label="Ingrédient" variant="outlined" />}
      color="secondary"
      onChange={this.handleIngredientChange}
      />

      <p></p>

      <TextField
        error={checkInput}
        id="standard-number"
        label="Poids (g)"
        type="number"
        variant="outlined"
        helperText={checkInput ? "Veuillez entrer un chiffre correct" : "" }
        onChange={this.handleChange}
      />

      <p></p>

      {authoNext
        ? <IngredientTable typeRecette={typeRecette} poidsIngredient={poidsIngredient} chosenIngredient={chosen} nomRecipe={nomRecipe} chosenRecipe={chosenRecipe}/>
        : ""
      }


    </div>

    )
  }
}

export default PetitPain;
