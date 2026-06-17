import { DataType } from "./dataType";
import { FILE_TYPES, type Instance } from "./fileTypes";
import { BinaryReader } from "./misc";
import { demangle } from "./nameMangling";
import type { Section, Symbol } from "./types";
import { type Peekable } from "./util";
import type { Relocation } from "./types";

/**
 * Handles parsing and serialization of data_BattleUnitParts.elf
 * This file contains all battle unit parts definitions used in battles
 */

export interface BattleUnitPartsRawInstance {
	id: string
	mUnitPartsName: string
	// This will be populated with children during parsing
	battleUnitParts?: Instance<DataType.BattleUnitPart>[]
}

export interface BattleUnitPartsLookup {
	mUnitPartsName: string
	battleUnitParts: Instance<DataType.BattleUnitPart>[]
}

export function parseBattleUnitParts(
	dataSection: Section,
	stringSection: Section,
	symbolTable: Symbol[],
	allRelocations: Map<string, Peekable<[number, Relocation]>>,
	findSymbol: (name: string) => Symbol,
	parseRange: (section: Section, stringSection: Section, startOffset: number, count: number, dataType: DataType) => any[]
): { [category: string]: any[] } {
	const data: { [category: string]: any[] } = {}
	const partsLookup: BattleUnitPartsLookup[] = []

	// Get the main symbol for battle unit parts
	const mainSymbol = findSymbol("wld::btl::data::s_Data")
	if (!mainSymbol) {
		throw new Error("Could not find main symbol 'wld::btl::data::s_Data' for BattleUnitParts")
	}

	// Parse the main table
	const reader = new BinaryReader(dataSection.content)
	reader.position = mainSymbol.location.value

	// Calculate how many parts lookup entries there are
	const partsCount = mainSymbol.size / FILE_TYPES[DataType.BattleUnitPartsLookup].size

	for (let i = 0; i < partsCount; i++) {
		const partsLookupEntry = parseRange(
			dataSection,
			stringSection,
			mainSymbol.location.value + (i * FILE_TYPES[DataType.BattleUnitPartsLookup].size),
			1,
			DataType.BattleUnitPartsLookup
		)[0]

		// Parse individual battle unit parts for this entry
		const partsSymbolName = partsLookupEntry.mBattleUnitParts
		const partsSymbol = findSymbol(partsSymbolName)

		if (partsSymbol) {
			const partsCount = partsSymbol.size / FILE_TYPES[DataType.BattleUnitPart].size
			const battleUnitParts = parseRange(
				dataSection,
				stringSection,
				partsSymbol.location.value,
				partsCount,
				DataType.BattleUnitPart
			)

			partsLookup.push({
				mUnitPartsName: partsLookupEntry.mUnitPartsName,
				battleUnitParts,
			})
		}
	}

	data.main = partsLookup
	return data
}

export function serializeBattleUnitParts(data: BattleUnitPartsLookup[], dataType: DataType): ArrayBuffer {
	const { BinaryWriter } = require("./misc")
	const writer = new BinaryWriter()

	// Serialize each parts lookup entry with its children
	for (const lookup of data) {
		// Serialize battle unit parts for this lookup
		for (const part of lookup.battleUnitParts) {
			serializeBattleUnitPart(writer, part)
		}
	}

	// Serialize main lookup table
	for (const lookup of data) {
		writer.writeString(lookup.mUnitPartsName)
		writer.writeInt32(lookup.battleUnitParts.length)
	}

	return writer.toArrayBuffer()
}

function serializeBattleUnitPart(writer: any, part: Instance<DataType.BattleUnitPart>): void {
	// Write in the order defined in fileTypes.ts
	writer.writeInt32(part.mPartNumber ?? 0)
	writer.writeInt32(part.padding ?? 0)
	writer.writeString(part.partID ?? "")
	writer.writeString(part.modelName ?? "")
	writer.writeUint32(part.field_0x18 ?? 0)
	writer.writeUint32(part.field_0x1C ?? 0)
	writer.writeFloat32(part.field_0x20 ?? 0)
	writer.writeUint32(part.field_0x24 ?? 0)
	writer.writeFloat32(part.field_0x28 ?? 0)
	writer.writeUint32(part.field_0x2C ?? 0)
	// Vector3
	writer.writeFloat32(part.base_hit_offset?.x ?? 0)
	writer.writeFloat32(part.base_hit_offset?.y ?? 0)
	writer.writeFloat32(part.base_hit_offset?.z ?? 0)
	writer.writeUint32(part.field_0x3C ?? 0)
	// Vector3
	writer.writeFloat32(part.hit_cursor_offset?.x ?? 0)
	writer.writeFloat32(part.hit_cursor_offset?.y ?? 0)
	writer.writeFloat32(part.hit_cursor_offset?.z ?? 0)
	writer.writeUint32(part.field_0x4C ?? 0)
	writer.writeUint32(part.field_0x50 ?? 0)
	writer.writeUint32(part.field_0x54 ?? 0)
	writer.writeUint32(part.field_0x58 ?? 0)
	writer.writeUint32(part.field_0x5C ?? 0)
	writer.writeUint32(part.field_0x60 ?? 0)
	writer.writeUint32(part.field_0x64 ?? 0)
	writer.writeString(part.mDefenseTblName ?? "")
	writer.writeString(part.mDefenseAttrTblName ?? "")
	writer.writeUint32(part.mPartsAttrFlags ?? 0)
	writer.writeUint32(part.mPartsCounterAttrFlags ?? 0)
	writer.writeString(part.mPoseTblName ?? "")
	writer.writeUint32(part.field_0x88 ?? 0)
	writer.writeUint32(part.field_0x8C ?? 0)
}
