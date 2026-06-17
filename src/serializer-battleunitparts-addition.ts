		case DataType.BattleUnitParts: {
			const dataSymbols = new Map()
			symbolRelocations.set('.data', dataSymbols)
			const dataSymbolAddrs = new Map()
			symbolAddrRelocations.set('.data', dataSymbolAddrs)

			let data: SerializeContext = {
				writer: dataWriter,
				stringRelocations: dataStringRelocations,
				symbolRelocations: dataSymbols,
				symbolAddrRelocations: dataSymbolAddrs,
			}

			// Serialize individual battle unit parts for each entry
			for (const unitParts of binary.data.main as Instance<DataType.BattleUnitParts>[]) {
				allStrings.add(unitParts.id)
				allStrings.add(unitParts.mUnitPartsName)

				const parts = unitParts.mBattleUnitParts as { children: Instance<DataType.BattleUnitPart>[], symbolName: string }
				
				if (!parts || !parts.children) {
					continue
				}

				const { children, symbolName } = parts

				symbolLocationReference.set(symbolName, new Pointer(dataWriter.size))
				symbolSizeOverrides.set(symbolName, (children.length + 1) * FILE_TYPES[DataType.BattleUnitPart].size)

				// Add parts string relocations
				serializeObjects(data, DataType.BattleUnitPart, children, { padding: 1 })
			}

			// Serialize main header
			symbolLocationReference.set("wld::btl::data::s_Data", new Pointer(dataWriter.size))
			symbolSizeOverrides.set("wld::btl::data::s_Data", binary.data.main.length * FILE_TYPES[DataType.BattleUnitParts].size)
			serializeObjects(data, DataType.BattleUnitParts, binary.data.main)

			// Serialize data count
			symbolLocationReference.set("wld::btl::data::s_DataNum", new Pointer(dataWriter.size))
			dataWriter.writeInt32(binary.data.main.length)

			break
		}
