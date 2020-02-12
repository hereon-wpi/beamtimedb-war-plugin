/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 11.02.2020
 */
export function parseBeamtime(beamtime) {
    const result = [];
    for (const key in Object.keys(beamtime)) {
        if (["applicant", "leader", "pi"].includes(key)) {

        } else if (["scans", "recos"].includes(key)) {

        } else {
            result.push({
                id: `${beamtime.id}.${key}`,
                key,
                value: beamtime[key]
            })
        }
    }
    return result;
}

export function newBeamtimesTreeTable() {
    return {
        view: "treetable",
        id: "output",
        columns: [
            {
                id: "key",
                width: 250,
                header: {content: "textFilter"},
                template: "{common.treetable()} #key#"
            },
            {
                id: "value",
                fillspace: true,
                header: {content: "textFilter"}
            }
        ]
    }
}
