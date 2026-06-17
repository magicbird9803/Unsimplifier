		case DataType.BattleUnitParts: {
			const dataSection = findSection('.data')
			const dataStringSection = findSection('.rodata.str1.1')

			data = {}

			let headerRelocs = peekable(allRelocations.get(".data"))

			let headerSymbol = findSymbol("wld::btl::data::s_Data")
			let header = parseSymbol(dataSection, dataStringSection, headerSymbol, DataType.BattleUnitParts, { count: -1, relocations: headerRelocs })
			
			data.main = header

			// parse battle unit parts for each entry
			for (const entry of header) {
				const { mBattleUnitParts: symbolName } = entry

				if (symbolName == undefined || symbolName == Pointer.NULL) {
					entry.mBattleUnitParts = null
					continue
				}

				let partsRelocs = peekable(allRelocations.get(".data"))
				let partsSymbol = findSymbol(symbolName)
				
				if (!partsSymbol) {
					console.warn(`Could not find symbol for battle unit parts: ${symbolName}`)
					continue
				}

				let parts = parseSymbol(dataSection, dataStringSection, partsSymbol, DataType.BattleUnitPart, { relocations: partsRelocs })

				let partsObj = {
					symbolName,
					children: parts,
				}

				entry.mBattleUnitParts = partsObj
			}

			break
		}
