import { Ballot } from "../../../../domain_model/Ballot"
import { Election } from "../../../../domain_model/Election"
import { ElectionRoll } from "../../../../domain_model/ElectionRoll"
import { Imsg } from "./IEmail"

const emailSettings: Partial<Imsg> = {
    asm: {
        groupId: 21140
    },
    mail_settings: process.env.EMAIL_TEST_MODE ? {
        "sandbox_mode": {
            "enable": true
        }
    } : undefined
}

export function Invites(election: Election, voters: ElectionRoll[], url: string): Imsg[] {
    return voters.map((voter) => <Imsg>{
        ...emailSettings,
        to: voter.email, // Change to your recipient
        from: 'elections@star.vote', // Change to your verified sender
        subject: `Invitation to Vote In ${election.title}`,
        text: `You have been invited to vote in ${election.title} ${url}/Election/${election.election_id}`,
        html: `<div> 
                    <h3> You have been invited to vote in ${election.title}</h3> <a clicktracking="off" href="${url}/Election/${election.election_id}/${election.settings.voter_authentication.voter_id === true ? 'id/' + voter.voter_id : ''}" >Link to Election</a>
                </div>    
                <div> 
                    <%asm_group_unsubscribe_url%>  
                </div>   
                `,
    })
}

export function Receipt(election: Election, email: string, ballot: Ballot, url: string): Imsg {
    return {
        ...emailSettings,
        to: email, // Change to your recipient
        from: 'elections@star.vote', // Change to your verified sender
        subject: `Ballot Receipt For ${election.title}`,
        text: `Thank you for voting in ${election.title}, you can view your ballot and ballot status at ${url}/Election/${election.election_id}/ballot/${ballot.ballot_id}`,
        html: `<div> 
                    <h3> 
                        Thank you for voting in ${election.title}, you can verify your ballot and ballot status <a clicktracking="off" href="${url}/Election/${election.election_id}/ballot/${ballot.ballot_id}" >here</a>  
                    </h3> 
                </div>    
                <div> 
                    <%asm_group_unsubscribe_url%>  
                </div>   `,
    }
}