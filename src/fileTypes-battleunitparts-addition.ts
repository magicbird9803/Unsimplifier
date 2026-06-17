	[DataType.BattleUnitParts]: {
		__: {
			displayName: "Battle Unit Parts",
			romfsPath: "data/battle/data_BattleUnitParts.elf.zst",
			mainSymbol: "wld::btl::data::s_Data",
			countSymbol: "wld::btl::data::s_DataNum",
			defaultPadding: 1,
			childTypes: {
				parts: DataType.BattleUnitPart,
			},
		},

		id: "string",
		mUnitPartsName: new Property("string", "The name identifier of this battle unit parts group"),
		mBattleUnitParts: new Property("symbolAddr", undefined, { hidden: true }),
	},

	[DataType.BattleUnitPartsLookup]: {
		__: {
			displayName: "Battle Unit Parts Lookup",
			identifyingField: "mUnitPartsName",
			dataCategory: null,
			childTypes: {
				battleUnitParts: DataType.BattleUnitPart,
			},
		},

		mUnitPartsName: new Property("string", "Reference to the battle unit parts symbol"),
		battleUnitParts: new Property("symbolAddr", undefined, { tabName: "Parts for {mUnitPartsName}" }),
	},

	[DataType.BattleUnitPart]: {
		__: {
			displayName: "Battle Unit Part",
			identifyingField: "partID",
			dataCategory: null,
		},

		mPartNumber: new Property("int", "Part number/index"),
		padding: new Property("int", "Padding field"),
		partID: new Property("string", "Unique identifier for this part"),
		modelName: new Property("string", "Model name reference"),
		field_0x18: new Property("int", "Unknown field 0x18"),
		field_0x1C: new Property("int", "Unknown field 0x1C"),
		field_0x20: new Property("float", "Unknown field 0x20"),
		field_0x24: new Property("int", "Unknown field 0x24"),
		field_0x28: new Property("float", "Unknown field 0x28"),
		field_0x2C: new Property("int", "Unknown field 0x2C"),
		base_hit_offset: new Property("Vector3", "Base hit offset coordinates"),
		field_0x3C: new Property("int", "Unknown field 0x3C"),
		hit_cursor_offset: new Property("Vector3", "Hit cursor offset coordinates"),
		field_0x4C: new Property("int", "Unknown field 0x4C"),
		field_0x50: new Property("int", "Unknown field 0x50"),
		field_0x54: new Property("int", "Unknown field 0x54"),
		field_0x58: new Property("int", "Unknown field 0x58"),
		field_0x5C: new Property("int", "Unknown field 0x5C"),
		field_0x60: new Property("int", "Unknown field 0x60"),
		field_0x64: new Property("int", "Unknown field 0x64"),
		mDefenseTblName: new Property("string", "Defense table reference"),
		mDefenseAttrTblName: new Property("string", "Defense attribute table reference"),
		mPartsAttrFlags: new Property("int", "Parts attribute flags"),
		mPartsCounterAttrFlags: new Property("int", "Parts counter attribute flags"),
		mPoseTblName: new Property("string", "Pose table reference"),
		field_0x88: new Property("int", "Unknown field 0x88"),
		field_0x8C: new Property("int", "Unknown field 0x8C"),
	},
