/* alchemy is based on narg by Neffc, and alchemy.js by Dregu.
    
    narg:       https://github.com/Neffc/narg
    neffc:      https://github.com/Neffc
    
    alchemy.js: https://github.com/Dregu/alchemy.js
    dregu:      https://github.com/Dregu
*/
{
    const Materials = {
        liquids: ["water","water_ice","water_swamp",
            "oil","alcohol","swamp",
            "mud","blood","blood_fungi",
            "blood_worm","radioactive_liquid","cement",
            "acid","lava","urine",
            "poison","magic_liquid_teleportation","magic_liquid_polymorph",
            "magic_liquid_random_polymorph","magic_liquid_berserk","magic_liquid_charm",
            "magic_liquid_invisibility"],
        solids: ["sand","bone","soil",
            "honey","slime","snow",
            "rotten_meat","wax","gold",
            "silver","copper","brass",
            "diamond","coal","gunpowder",
            "gunpowder_explosive","grass","fungi"]
    }
    
    const SEEDMAX = 0xFFFFFFFF
    const INT32 = 0x7FFFFFFF
    
    const Alchemy = class {
        random (num, count) {
            for (let i = 0; i < count; i++) {
                num = 16807 * (num % 127773) - 2836 * Math.floor(num / 127773)
                if (num < 0)
                    num += INT32
            }
            return num
        }
        shuffle (arr, seed) {
            let n = this.random(Math.floor(seed / 2) + 12534, 1)
            for (let i = arr.length; i > 0; i--) {
                n = this.random(n, 1)
                let x = Math.floor(n / INT32 * i),
                    o = arr[i-1]
                arr[i] = arr[x]
                arr[x] = o
            }
        }
        material (pool) {
            while (true) {
                this.iseed = this.random(this.iseed, 1)
                let n = Math.floor(pool.length * (this.iseed / INT32)),
                    material = pool[n]
                if (material) {
                    pool[n] = false
                    return material
                }
            }
        }
        recipe (seed) {
            let liquids = [...Materials.liquids],
                solids = [...Materials.solids],
                materials = []
            for (let i = 0; i < 3; i++)
                materials.push(this.material(liquids))
                materials.push(this.material(solids))
            this.shuffle(materials, seed)
            return materials.slice(1, 4)
        }
        constructor (buffer) {
            switch (typeof buffer) {
                case "string":
                case "number":
                    let normalized = typeof buffer === "string"?
                        parseInt(buffer.replace(/\s+/g, "")):
                        buffer
                    if (normalized) this.seed = normalized
                    else this.error = `Received ${typeof buffer} buffer, but failed to parse it.`
                    break
                default:
                    this.error = `Expecting string or number buffer, received ${typeof buffer}.`
                    break
            }
            
            if ("seed" in this && this.seed < SEEDMAX) {
                this.iseed = Math.floor(this.seed * 0.17127 + 1323.5903)
                this.recipes = {
                    "Lively Concoction": (this.iseed = this.random(this.iseed, 6)) && this.recipe(this.seed),
                    "Alchemical Precursor": (this.iseed = this.random(this.iseed, 2)) && this.recipe(this.seed)
                }
            } else if (this.seed > SEEDMAX) {
                this.error = `Received buffer is too large, max value is ${SEEDMAX}.`
            }
            return this
        }
    }
    
    Object.assign(this, {Alchemy, Materials, INT32, SEEDMAX})
}
