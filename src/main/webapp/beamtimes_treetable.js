/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 11.02.2020
 */
function newUserColumns(who) {
    return [
        {
            id: `${who}.email`,
            header: [{text: who, css: {"text-align": "center"}, colspan: 5}, "Email"],
            template(obj) {
                return obj[who].email;
            }
        },
        {
            id: `${who}.institute`,
            header: ["", "Institute"],
            template(obj) {
                return obj[who].institute;
            }
        },
        {
            id: `${who}.lastname`,
            header: ["", "Lastname"],
            template(obj) {
                return obj[who].lastname;
            }
        },
        {
            id: `${who}.userid`,
            header: ["", "UserId"],
            template(obj) {
                return obj[who].userId;
            }
        },
        {
            id: `${who}.username`,
            header: ["", "Username"],
            template(obj) {
                return obj[who].username;
            }
        }
    ]
}


export default function newBeamtimesTreeTable() {
    return {
        view: "treetable",
        id: "output",
        columns: [
            {
                id: "beamtimeId",
                header: "Id",
                template: "{common.treetable()} #beamtimeId#"
            }
        ].concat(newUserColumns("applicant"))
            .concat({
                    id: "beamline",
                    header: "Beamline"
                },
                {
                    id: "beamline_alias",
                    header: "Alias"
                },
                {
                    id: "contact",
                    header: "Contact"
                },
                {
                    id: "event-start",
                    header: "Start"
                },
                {
                    id: "event-end",
                    header: "End"
                },
                {
                    id: "facility",
                    header: "Facility"
                }
            ).concat(newUserColumns("leader"))
            .concat(newUserColumns("pi"))
            .concat({
                id: "proposalId",
                header: "Proposal Id"
            }, {
                id: "proposalType",
                header: "Proposal Type"
            }, {
                id: "title",
                header: "Title",
                width: 250
            }, {
                id: "unixId",
                header: "Unix Id"
            })
    }
}
