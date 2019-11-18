const MaterialContainer = class {
    constructor ({name, description}) {
        this.material = document.createElement("div")
        this.aligner = document.createElement("div")
        this.alignee = document.createElement("div")
        this.name = document.createElement("div")
        
        this.name.innerText = name
        
        this.material.className = "material"
        this.aligner.className = "aligner"
        this.alignee.className = "alignee"
        this.name.className = "name"
        
        this.material.appendChild(this.aligner)
        this.material.appendChild(this.alignee)
        this.alignee.appendChild(this.name)
        
        return this.material
    }
}
const RecipeContainer = class {
    constructor ({name, materials}) {
        this.recipe = document.createElement("dl")
        this.name = document.createElement("dt")
        this.materials = document.createElement("dd")
        
        if (materials) {
            for (let i = 0, l = materials.length; i < l; i++) {
                let material = new MaterialContainer({
                    name: materials[i],
                    description: materials[i]
                })
                this.materials.appendChild(material)
            }
        }
        
        this.name.innerText = name
        
        this.recipe.className = "recipe"
        this.name.className = "name"
        this.materials.className = "materials"
        
        this.recipe.appendChild(this.name)
        this.recipe.appendChild(this.materials)
        return this.recipe
    }
}
const AlchemyContainer = class {
    constructor ({seed, recipes}) {
        this.alchemy = document.createElement("dl")
        this.seed = document.createElement("dt")
        this.recipes = document.createElement("dd")
        
        if (recipes)
        for (let i in recipes)
            this.recipes.appendChild(new RecipeContainer({name: i, materials: recipes[i]}))
        
        this.seed.innerText = seed
        
        this.alchemy.className = "alchemy"
        this.seed.className = "seed"
        this.recipes.className = "recipes"
        
        this.alchemy.id = `alchemy-${seed}`
        
        this.alchemy.appendChild(this.seed)
        this.alchemy.appendChild(this.recipes)
        return this.alchemy
    }
}

let seedReading = 0,
    seedCache = {},
    initializer = waitForUserFocus => {
        const MaintainSeedReading = ReadSeed => {
            let currentSeed = userInputField.value
            if (currentSeed !== seedReading) {
                if (currentSeed !== "") {
                    let alchemy = seedCache[currentSeed] || new Alchemy(currentSeed)
                    
                    if ("recipes" in alchemy) {
                        results.innerHTML = ""
                        results.appendChild(new AlchemyContainer(alchemy))
                    } else if ("error" in alchemy) {
                        console.warn(alchemy.error)
                        statusDetail.innerText = `Ouch! ${alchemy.error}`
                    }
                    
                    if (!seedCache[currentSeed])
                        seedCache[currentSeed] = alchemy
                } else {
                    results.innerHTML = ""
                }
                seedReading = currentSeed
            }
            requestIdleCallback(MaintainSeedReading)
        }
        requestIdleCallback(MaintainSeedReading)
        userInputField.removeEventListener("focus", initializer)
    }
userInputField.addEventListener("focus", initializer)
