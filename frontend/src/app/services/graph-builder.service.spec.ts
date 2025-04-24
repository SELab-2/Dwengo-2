import { TestBed } from '@angular/core/testing';
import { GraphBuilderService } from './graph-builder.service';
import { MinimalLearningObject, MinimalShallowLearningObject } from '../interfaces/learning-object';

describe('GraphBuilderService', () => {
    let service: GraphBuilderService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GraphBuilderService);
    });

    it('should build a graph connecting shallow objects using transitions', () => {
        // Given: minimal shallow objects with a single transition
        const shallowObjects: MinimalShallowLearningObject[] = [
            {
                hruid: 'intro',
                version: 1,
                language: 'en',
                startNode: true,
                transitions: [{ hruid: 'next', version: 1, language: 'en' }],
            },
            {
                hruid: 'next',
                version: 1,
                language: 'en',
                startNode: false,
                transitions: [],
            }
        ];

        // And: corresponding minimal learning objects
        const detailedObjects: MinimalLearningObject[] = [
            {
                metadata: {
                    hruid: 'intro',
                    version: 1,
                    language: 'en'
                }
            },
            {
                metadata: {
                    hruid: 'next',
                    version: 1,
                    language: 'en'
                }
            }
        ];

        // When: building the graph
        const graph = service.buildTrajectoryGraph(shallowObjects, detailedObjects);

        // Then: the root should be the 'intro' object
        expect(graph.root?.value.metadata.hruid).toBe('intro');

        // And: 'intro' should have one child, 'next'
        expect(graph.getNeighbors(graph.root!.value)[0].value.metadata.hruid).toBe('next');

        // And: 'next' should have no children
        const nextNode = graph.getNeighbors(graph.root!.value)[0].value;
        expect(graph.getOutgoingEdges(nextNode).length).toBe(0);
    });
});
