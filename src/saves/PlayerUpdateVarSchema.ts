import Decimal from 'break_infinity.js'
import { CorruptionLoadout, type Corruptions, CorruptionSaves } from '../Corruptions'
import { getTalisman } from '../Talismans'
import { convertArrayToCorruption } from './PlayerJsonSchema'
import { playerSchema } from './PlayerSchema'

export const playerUpdateVarSchema = playerSchema.transform((player) => {
  if (player.usedCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.usedCorruptions)
    player.corruptions.used = new CorruptionLoadout(corrLoadout)
  }

  if (player.prototypeCorruptions !== undefined) {
    const corrLoadout = convertArrayToCorruption(player.prototypeCorruptions)
    player.corruptions.next = new CorruptionLoadout(corrLoadout)
  }

  if (player.corruptionShowStats !== undefined) {
    player.corruptions.showStats = player.corruptionShowStats
  }

  if (player.corruptionLoadouts !== undefined && player.corruptionLoadoutNames !== undefined) {
    const corruptionSaveStuff = player.corruptionLoadoutNames.reduce(
      (map, key, index) => {
        if (player.corruptionLoadouts?.[index + 1]) {
          map[key] = convertArrayToCorruption(player.corruptionLoadouts[index + 1] ?? Array(100).fill(0))
        }
        return map
      },
      {} as Record<string, Corruptions>
    )

    player.corruptions.saves = new CorruptionSaves(corruptionSaveStuff)
  }

  if (player.ultimatePixels !== undefined || player.cubeUpgradeRedBarFilled !== undefined) {
    // One-time conversion for red bar filled and ultimate pixels (to a lesser degree)

    const redBarFilled = player.cubeUpgradeRedBarFilled ?? 0
    const ultimatePixels = player.ultimatePixels ?? 0

    player.redAmbrosia += Math.floor(ultimatePixels * 0.2 + redBarFilled)
    player.lifetimeRedAmbrosia += Math.floor(ultimatePixels * 0.2 + redBarFilled)
  }

  if (player.talismanLevels !== undefined) {
    getTalisman('exemption').updateResourcePredefinedLevel(player.talismanLevels[0])
    getTalisman('chronos').updateResourcePredefinedLevel(player.talismanLevels[1])
    getTalisman('midas').updateResourcePredefinedLevel(player.talismanLevels[2])
    getTalisman('metaphysics').updateResourcePredefinedLevel(player.talismanLevels[3])
    getTalisman('polymath').updateResourcePredefinedLevel(player.talismanLevels[4])
    getTalisman('mortuus').updateResourcePredefinedLevel(player.talismanLevels[5])
    getTalisman('plastic').updateResourcePredefinedLevel(player.talismanLevels[6])
  }

  if (player.runeexp !== undefined) {
    player.runes.speed = new Decimal(player.runeexp[0] ?? 0)
    player.runes.duplication = new Decimal(player.runeexp[1] ?? 0)
    player.runes.prism = new Decimal(player.runeexp[2] ?? 0)
    player.runes.thrift = new Decimal(player.runeexp[3] ?? 0)
    player.runes.superiorIntellect = new Decimal(player.runeexp[4] ?? 0)
    player.runes.infiniteAscent = new Decimal(player.runeexp[5] ?? 0)
    player.runes.antiquities = new Decimal(player.runeexp[6] ?? 0)
  }

  Reflect.deleteProperty(player, 'runeexp')
  Reflect.deleteProperty(player, 'runelevels')
  Reflect.deleteProperty(player, 'usedCorruptions')
  Reflect.deleteProperty(player, 'prototypeCorruptions')
  Reflect.deleteProperty(player, 'corruptionShowStats')
  Reflect.deleteProperty(player, 'corruptionLoadouts')
  Reflect.deleteProperty(player, 'corruptionLoadoutNames')
  Reflect.deleteProperty(player, 'ultimatePixels')
  Reflect.deleteProperty(player, 'cubeUpgradeRedBarFilled')
  Reflect.deleteProperty(player, 'talismanLevels')
  Reflect.deleteProperty(player, 'talismanRarity')
  Reflect.deleteProperty(player, 'talismanOne')
  Reflect.deleteProperty(player, 'talismanTwo')
  Reflect.deleteProperty(player, 'talismanThree')
  Reflect.deleteProperty(player, 'talismanFour')
  Reflect.deleteProperty(player, 'talismanFive')
  Reflect.deleteProperty(player, 'talismanSix')
  Reflect.deleteProperty(player, 'talismanSeven')

  return player
})
